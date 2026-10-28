import { querySql } from './db';
import { Barbeiro, Servico, AgendamentoItem, SlotHorario } from './types';
import { generateGoogleCalendarUrl } from './googleCalendar';

// -------------------------------------------------------------
// HELPERS DE DATA/HORA LOCAL (AMERICA/SAO_PAULO - SEM DESVIO UTC)
// -------------------------------------------------------------
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatLocalSqlDateTime(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatLocalIsoDateTime(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatLocalDateOnly(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isValidDateStr(dataStr: string): boolean {
  if (typeof dataStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
    return false;
  }
  const [y, m, d] = dataStr.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 2000 || y > 2100) {
    return false;
  }
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function parseLocalDateTime(str: string): Date {
  if (!str || typeof str !== 'string') return new Date(NaN);
  if (str.endsWith('Z')) {
    return new Date(str);
  }
  const clean = str.replace('T', ' ').trim();
  const parts = clean.split(' ');
  if (parts.length !== 2) return new Date(NaN);
  const [datePart, timePart] = parts;
  if (!isValidDateStr(datePart)) return new Date(NaN);
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(timePart)) return new Date(NaN);

  const [y, m, d] = datePart.split('-').map(Number);
  const timePieces = timePart.split(':');
  const hh = parseInt(timePieces[0], 10);
  const mm = parseInt(timePieces[1], 10);
  const ss = timePieces[2] ? parseInt(timePieces[2], 10) : 0;

  if (hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) {
    return new Date(NaN);
  }
  return new Date(y, m - 1, d, hh, mm, ss);
}

// -------------------------------------------------------------
// SERVIÇOS E BARBEIROS (COM CACHE EM MEMÓRIA PARA ALTA DEMANDA)
// -------------------------------------------------------------
let servicosCache: { data: Servico[]; expiresAt: number } | null = null;
let barbeirosCache: { data: Barbeiro[]; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 segundos de cache para suportar milhares de requisições simultâneas

export async function getServicos(forceRefresh = false): Promise<Servico[]> {
  const now = Date.now();
  if (!forceRefresh && servicosCache && servicosCache.expiresAt > now) {
    return servicosCache.data;
  }
  try {
    const rows = await querySql<Servico>(
      'SELECT id, nome, categoria, CAST(preco AS FLOAT) as preco, duracao_min, ativo FROM Servicos WHERE ativo = 1 ORDER BY categoria, nome'
    );
    if (rows && rows.length > 0) {
      servicosCache = { data: rows, expiresAt: now + CACHE_TTL_MS };
    }
    return rows;
  } catch (error) {
    console.error('Falha ao buscar serviços no SQL Server:', error);
    return servicosCache ? servicosCache.data : [];
  }
}

export async function getBarbeiros(forceRefresh = false): Promise<Barbeiro[]> {
  const now = Date.now();
  if (!forceRefresh && barbeirosCache && barbeirosCache.expiresAt > now) {
    return barbeirosCache.data;
  }
  try {
    const rows = await querySql<Barbeiro>(
      'SELECT id, nome, foto_url, bio, ativo FROM Barbeiros WHERE ativo = 1 ORDER BY id'
    );
    if (rows && rows.length > 0) {
      barbeirosCache = { data: rows, expiresAt: now + CACHE_TTL_MS };
    }
    return rows;
  } catch (error) {
    console.error('Falha ao buscar barbeiros no SQL Server:', error);
    return barbeirosCache ? barbeirosCache.data : [];
  }
}

// -------------------------------------------------------------
// HORÁRIOS LIVRES E DISPONIBILIDADE
// -------------------------------------------------------------
export function getHorarioFuncionamento(diaSemana: number): { abre: string; fecha: string } | null {
  if (diaSemana === 1) return null; // Segunda fechado
  if (diaSemana === 0) return { abre: '08:00', fecha: '12:00' }; // Domingo
  if (diaSemana === 6) return { abre: '08:00', fecha: '20:00' }; // Sábado
  return { abre: '09:00', fecha: '20:00' }; // Terça a Sexta
}

export async function getHorariosLivres(
  dataStr: string, // YYYY-MM-DD
  duracaoTotalMin: number,
  barbeiroId?: number | null
): Promise<SlotHorario[]> {
  if (!isValidDateStr(dataStr)) return [];
  if (!Number.isFinite(duracaoTotalMin) || duracaoTotalMin <= 0 || duracaoTotalMin > 480) return [];

  const [year, month, day] = dataStr.split('-').map(Number);
  const dataAlvo = new Date(year, month - 1, day);
  const diaSemana = dataAlvo.getDay();

  const expediente = getHorarioFuncionamento(diaSemana);
  if (!expediente) return []; // Barbearia fechada

  const [abreHora, abreMin] = expediente.abre.split(':').map(Number);
  const [fechaHora, fechaMin] = expediente.fecha.split(':').map(Number);
  const fechamentoMinutos = fechaHora * 60 + fechaMin;

  const barbeiros = await getBarbeiros();
  const barbeirosParaVerificar = barbeiroId
    ? barbeiros.filter(b => Number(b.id) === Number(barbeiroId))
    : barbeiros;

  if (barbeirosParaVerificar.length === 0) return [];

  const todosAgendamentos = await getAgendamentosDoDia(dataStr);

  const agora = new Date();
  const toleranciaLimpezaMin = 10; // 10 min de intervalo antes e depois de cada atendimento
  const antecedenciaMinutos = 30; // 30 min mínimo antes de começar

  const slots: SlotHorario[] = [];

  for (let minAtual = abreHora * 60 + abreMin; minAtual + duracaoTotalMin <= fechamentoMinutos; minAtual += 30) {
    const hora = Math.floor(minAtual / 60);
    const minuto = minAtual % 60;
    const horarioStr = `${pad(hora)}:${pad(minuto)}`;

    const slotInicio = new Date(year, month - 1, day, hora, minuto, 0);
    const slotFim = new Date(slotInicio.getTime() + duracaoTotalMin * 60000);

    const diferencaMinutosAgora = (slotInicio.getTime() - agora.getTime()) / 60000;
    if (diferencaMinutosAgora < antecedenciaMinutos) {
      continue;
    }

    let barbeiroDisponivel: Barbeiro | null = null;
    let menorCargaAgendamentos = Infinity;

    for (const b of barbeirosParaVerificar) {
      const conflito = todosAgendamentos.some(ag => {
        if (Number(ag.barbeiro_id) !== Number(b.id) || ag.status === 'Cancelado') return false;
        const agInicio = parseLocalDateTime(ag.data_hora_inicio).getTime();
        const agFimComTolerancia = parseLocalDateTime(ag.data_hora_fim).getTime() + (toleranciaLimpezaMin * 60000);
        const slotInicioTempo = slotInicio.getTime();
        const slotFimComTolerancia = slotFim.getTime() + (toleranciaLimpezaMin * 60000);

        return (slotInicioTempo < agFimComTolerancia && agInicio < slotFimComTolerancia);
      });

      if (!conflito) {
        const contagemHoje = todosAgendamentos.filter(ag => Number(ag.barbeiro_id) === Number(b.id) && ag.status !== 'Cancelado').length;
        if (contagemHoje < menorCargaAgendamentos) {
          menorCargaAgendamentos = contagemHoje;
          barbeiroDisponivel = b;
        }
      }
    }

    if (barbeiroDisponivel) {
      slots.push({
        horario: horarioStr,
        disponivel: true,
        barbeiro_id: barbeiroDisponivel.id,
        barbeiro_nome: barbeiroDisponivel.nome
      });
    }
  }

  return slots;
}

async function getAgendamentosDoDia(dataStr: string): Promise<AgendamentoItem[]> {
  try {
    const sqlQuery = `
      SELECT a.id, a.cliente_id, c.nome as cliente_nome, c.whatsapp as cliente_whatsapp,
             a.barbeiro_id, b.nome as barbeiro_nome,
             CONVERT(varchar(19), a.data_hora_inicio, 126) as data_hora_inicio,
             CONVERT(varchar(19), a.data_hora_fim, 126) as data_hora_fim,
             a.status, a.observacao
      FROM Agendamentos a
      JOIN Clientes c ON a.cliente_id = c.id
      JOIN Barbeiros b ON a.barbeiro_id = b.id
      WHERE a.data_hora_inicio >= CONVERT(datetime, ?, 120)
        AND a.data_hora_inicio < DATEADD(day, 1, CONVERT(datetime, ?, 120))
        AND a.status <> 'Cancelado'
    `;
    const inicioDia = `${dataStr} 00:00:00`;
    const rows = await querySql<AgendamentoItem>(sqlQuery, [inicioDia, inicioDia]);
    return rows;
  } catch (e) {
    console.error('Erro ao consultar agendamentos do dia no SQL Server:', e);
    return [];
  }
}

// -------------------------------------------------------------
// CRIAÇÃO DE AGENDAMENTO NO SQL SERVER (dev_database)
// -------------------------------------------------------------
interface NovoAgendamentoInput {
  clienteNome: string;
  clienteWhatsapp: string;
  barbeiroId?: number | null;
  servicosIds: number[];
  dataHoraInicio: string;
  observacao?: string;
}

export async function criarAgendamento(input: NovoAgendamentoInput): Promise<{
  sucesso: boolean;
  agendamento?: AgendamentoItem;
  erro?: string;
  statusCode?: 400 | 409 | 500;
}> {
  if (typeof input.clienteNome !== 'string') {
    return { sucesso: false, erro: 'Nome do cliente inválido.', statusCode: 400 };
  }
  const nomeLimpo = input.clienteNome.trim();
  if (nomeLimpo.length < 2 || nomeLimpo.length > 100) {
    return { sucesso: false, erro: 'O nome deve ter entre 2 e 100 caracteres.', statusCode: 400 };
  }

  if (typeof input.clienteWhatsapp !== 'string') {
    return { sucesso: false, erro: 'Telefone inválido.', statusCode: 400 };
  }
  const telLimpo = input.clienteWhatsapp.replace(/\D/g, '');
  if (telLimpo.length < 10 || telLimpo.length > 11) {
    return { sucesso: false, erro: 'Telefone inválido. Informe o DDD e o número com 10 ou 11 dígitos.', statusCode: 400 };
  }

  if (input.observacao !== undefined && input.observacao !== null) {
    if (typeof input.observacao !== 'string' || input.observacao.length > 500) {
      return { sucesso: false, erro: 'A observação deve ter no máximo 500 caracteres.', statusCode: 400 };
    }
  }
  const obsLimpa = input.observacao ? input.observacao.trim() : null;

  if (!Array.isArray(input.servicosIds) || input.servicosIds.length === 0 || input.servicosIds.length > 10) {
    return { sucesso: false, erro: 'Selecione entre 1 e 10 serviços válidos.', statusCode: 400 };
  }
  const idsUnicos: number[] = [];
  for (const rawId of input.servicosIds) {
    const numId = Number(rawId);
    if (!Number.isInteger(numId) || numId <= 0) {
      return { sucesso: false, erro: 'ID de serviço inválido.', statusCode: 400 };
    }
    if (!idsUnicos.includes(numId)) {
      idsUnicos.push(numId);
    }
  }

  const todosServicos = await getServicos();
  const servicosEscolhidos = idsUnicos
    .map(id => todosServicos.find(s => Number(s.id) === id))
    .filter((s): s is Servico => Boolean(s));

  if (servicosEscolhidos.length !== idsUnicos.length) {
    return { sucesso: false, erro: 'Um ou mais serviços selecionados não existem.', statusCode: 400 };
  }

  const duracaoTotalMin = servicosEscolhidos.reduce((acc, s) => acc + s.duracao_min, 0);
  const valorTotal = servicosEscolhidos.reduce((acc, s) => acc + s.preco, 0);

  const dtInicio = parseLocalDateTime(input.dataHoraInicio);
  if (isNaN(dtInicio.getTime())) {
    return { sucesso: false, erro: 'Data e horário de início inválidos ou incompletos. Por favor, volte ao Passo 3 e selecione um horário.', statusCode: 400 };
  }

  // Validar granularidade de 30 minutos
  if (dtInicio.getMinutes() % 30 !== 0 || dtInicio.getSeconds() !== 0) {
    return { sucesso: false, erro: 'Os agendamentos devem iniciar em intervalos de 30 minutos (ex: 09:00, 09:30).', statusCode: 400 };
  }

  // Validar antecedência mínima (30 min) e limite máximo no futuro (365 dias)
  const agora = new Date();
  const diffMinutosAgora = (dtInicio.getTime() - agora.getTime()) / 60000;
  if (diffMinutosAgora < 30) {
    return { sucesso: false, erro: 'O agendamento deve ser feito com pelo menos 30 minutos de antecedência.', statusCode: 400 };
  }
  const diffDiasFuturo = diffMinutosAgora / (60 * 24);
  if (diffDiasFuturo > 365) {
    return { sucesso: false, erro: 'Não é permitido agendar com mais de 1 ano de antecedência.', statusCode: 400 };
  }

  const dtFim = new Date(dtInicio.getTime() + duracaoTotalMin * 60000);
  const dataDiaStr = formatLocalDateOnly(dtInicio);

  // Validar dia da semana e horário de funcionamento
  const expediente = getHorarioFuncionamento(dtInicio.getDay());
  if (!expediente) {
    return { sucesso: false, erro: 'A barbearia permanece fechada neste dia da semana (segunda-feira).', statusCode: 400 };
  }
  const [abreH, abreM] = expediente.abre.split(':').map(Number);
  const [fechaH, fechaM] = expediente.fecha.split(':').map(Number);
  const abreMin = abreH * 60 + abreM;
  const fechaMin = fechaH * 60 + fechaM;
  const inicioMin = dtInicio.getHours() * 60 + dtInicio.getMinutes();
  const fimMin = inicioMin + duracaoTotalMin;

  if (inicioMin < abreMin || fimMin > fechaMin || formatLocalDateOnly(dtFim) !== dataDiaStr) {
    return {
      sucesso: false,
      erro: `Horário fora do expediente de funcionamento (${expediente.abre} às ${expediente.fecha}).`,
      statusCode: 400
    };
  }

  const barbeiros = await getBarbeiros();
  let candidatos: Barbeiro[];
  if (input.barbeiroId !== undefined && input.barbeiroId !== null) {
    const bId = Number(input.barbeiroId);
    if (!Number.isInteger(bId) || bId <= 0) {
      return { sucesso: false, erro: 'Barbeiro inválido.', statusCode: 400 };
    }
    const encontrado = barbeiros.find(b => Number(b.id) === bId);
    if (!encontrado) {
      return { sucesso: false, erro: 'O barbeiro selecionado não foi encontrado.', statusCode: 400 };
    }
    candidatos = [encontrado];
  } else {
    // Ordena os barbeiros pela menor carga do dia para equilibrar os agendamentos "sem preferência"
    const todosAgendamentosDia = await getAgendamentosDoDia(dataDiaStr);
    candidatos = [...barbeiros].sort((a, b) => {
      const cargaA = todosAgendamentosDia.filter(ag => Number(ag.barbeiro_id) === Number(a.id) && ag.status !== 'Cancelado').length;
      const cargaB = todosAgendamentosDia.filter(ag => Number(ag.barbeiro_id) === Number(b.id) && ag.status !== 'Cancelado').length;
      return cargaA - cargaB;
    });
  }

  if (candidatos.length === 0) {
    return { sucesso: false, erro: 'Nenhum barbeiro disponível.', statusCode: 409 };
  }

  try {
    const dtInicioSql = formatLocalSqlDateTime(dtInicio);
    const dtFimSql = formatLocalSqlDateTime(dtFim);
    const dtInicioIsoLocal = formatLocalIsoDateTime(dtInicio);
    const dtFimIsoLocal = formatLocalIsoDateTime(dtFim);

    // Monta verificação atômica para cada barbeiro candidato em ordem de preferência/menor carga
    const checksBarbeirosSql = candidatos
      .map(
        b => `
      IF @barbeiroEscolhido IS NULL AND NOT EXISTS (
          SELECT 1 FROM Agendamentos
          WHERE barbeiro_id = ${Number(b.id)}
            AND status <> 'Cancelado'
            AND data_hora_inicio < DATEADD(minute, 10, @dtFim)
            AND DATEADD(minute, 10, data_hora_fim) > @dtInicio
      )
      BEGIN
          SET @barbeiroEscolhido = ${Number(b.id)};
      END`
      )
      .join('\n');

    const insertServicosValuesSql = servicosEscolhidos
      .map(s => `(@agendamentoId, ${Number(s.id)}, ${Number(s.preco).toFixed(2)}, ${Number(s.duracao_min)})`)
      .join(', ');

    const atomicQuery = `
      SET NOCOUNT ON;
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;

      EXEC sp_getapplock
        @Resource = 'BarbeariaVal_Agendamento_Mutex',
        @LockMode = 'Exclusive',
        @LockOwner = 'Transaction',
        @LockTimeout = 15000;

      DECLARE @dtInicio DATETIME = CONVERT(datetime, ?, 120);
      DECLARE @dtFim DATETIME = CONVERT(datetime, ?, 120);

      DECLARE @clienteId INT = NULL;
      SELECT TOP 1 @clienteId = id FROM Clientes WHERE whatsapp = ?;

      IF @clienteId IS NULL
      BEGIN
          INSERT INTO Clientes (nome, whatsapp) VALUES (?, ?);
          SET @clienteId = SCOPE_IDENTITY();
      END
      ELSE
      BEGIN
          UPDATE Clientes SET nome = ? WHERE id = @clienteId;
      END

      -- Impede que o mesmo cliente faça dois agendamentos no mesmo horário (duplo clique)
      IF EXISTS (
          SELECT 1 FROM Agendamentos
          WHERE cliente_id = @clienteId
            AND status <> 'Cancelado'
            AND data_hora_inicio < @dtFim
            AND data_hora_fim > @dtInicio
      )
      BEGIN
          ROLLBACK TRANSACTION;
          SELECT -1 AS id, -1 AS cliente_id, -1 AS barbeiro_id;
      END
      ELSE
      BEGIN
          DECLARE @barbeiroEscolhido INT = NULL;

          ${checksBarbeirosSql}

          IF @barbeiroEscolhido IS NULL
          BEGIN
              ROLLBACK TRANSACTION;
              SELECT -1 AS id, -1 AS cliente_id, -1 AS barbeiro_id;
          END
          ELSE
          BEGIN
              INSERT INTO Agendamentos (cliente_id, barbeiro_id, data_hora_inicio, data_hora_fim, status, observacao)
              VALUES (@clienteId, @barbeiroEscolhido, @dtInicio, @dtFim, 'Pendente', ?);

              DECLARE @agendamentoId INT = SCOPE_IDENTITY();

              INSERT INTO AgendamentoServicos (agendamento_id, servico_id, preco_historico, duracao_historico)
              VALUES ${insertServicosValuesSql};

              COMMIT TRANSACTION;
              SELECT @agendamentoId AS id, @clienteId AS cliente_id, @barbeiroEscolhido AS barbeiro_id;
          END
      END
    `;

    const res = await querySql<{ id: number; cliente_id: number; barbeiro_id: number }>(atomicQuery, [
      dtInicioSql,
      dtFimSql,
      telLimpo,
      nomeLimpo,
      telLimpo,
      nomeLimpo,
      obsLimpa,
    ]);

    const row = res && res.length > 0 ? res[0] : null;
    if (!row || !row.id || row.id <= 0) {
      return {
        sucesso: false,
        erro: 'O horário selecionado já está ocupado para este barbeiro. Por favor, escolha outro horário disponível.',
        statusCode: 409,
      };
    }

    const barbeiroFinal = barbeiros.find(b => Number(b.id) === Number(row.barbeiro_id)) || candidatos[0];

    const calendarUrl = generateGoogleCalendarUrl({
      titulo: `Barbearia Val: ${servicosEscolhidos.map(s => s.nome).join(' + ')}`,
      clienteNome: nomeLimpo,
      clienteTelefone: telLimpo,
      barbeiroNome: barbeiroFinal.nome,
      servicosNomes: servicosEscolhidos.map(s => s.nome),
      valorTotal,
      dataHoraInicio: dtInicioIsoLocal,
      duracaoMinutos: duracaoTotalMin,
    });

    return {
      sucesso: true,
      agendamento: {
        id: row.id,
        cliente_id: row.cliente_id,
        cliente_nome: nomeLimpo,
        cliente_whatsapp: telLimpo,
        barbeiro_id: barbeiroFinal.id,
        barbeiro_nome: barbeiroFinal.nome,
        data_hora_inicio: dtInicioIsoLocal,
        data_hora_fim: dtFimIsoLocal,
        status: 'Pendente',
        observacao: obsLimpa,
        servicos: servicosEscolhidos,
        valor_total: valorTotal,
        duracao_total: duracaoTotalMin,
        google_calendar_url: calendarUrl,
      },
    };
  } catch (error: any) {
    console.error('Erro ao gravar agendamento no SQL Server:', error);
    return {
      sucesso: false,
      erro: 'Falha ao registrar agendamento no banco SQL Server: ' + error.message,
      statusCode: 500,
    };
  }
}

// -------------------------------------------------------------
// LISTAGEM ADMIN & STATUS NO SQL SERVER
// -------------------------------------------------------------
export const STATUS_AGENDAMENTO_VALIDOS = ['Pendente', 'Confirmado', 'Concluído', 'Cancelado', 'Faltou'] as const;

export async function listarAgendamentosAdmin(filtroBarbeiroId?: number): Promise<AgendamentoItem[]> {
  try {
    let query = `
      SELECT a.id, a.cliente_id, c.nome as cliente_nome, c.whatsapp as cliente_whatsapp,
             a.barbeiro_id, b.nome as barbeiro_nome,
             CONVERT(varchar(19), a.data_hora_inicio, 126) as data_hora_inicio,
             CONVERT(varchar(19), a.data_hora_fim, 126) as data_hora_fim,
             a.status, a.observacao
      FROM Agendamentos a
      JOIN Clientes c ON a.cliente_id = c.id
      JOIN Barbeiros b ON a.barbeiro_id = b.id
    `;
    const params: any[] = [];
    if (filtroBarbeiroId) {
      query += ` WHERE a.barbeiro_id = ?`;
      params.push(filtroBarbeiroId);
    }
    query += ` ORDER BY a.data_hora_inicio DESC`;

    const rows = await querySql<any>(query, params);
    return rows.map(item => ({
      ...item,
      google_calendar_url: generateGoogleCalendarUrl({
        titulo: `Barbearia Val - Agendamento`,
        clienteNome: item.cliente_nome,
        clienteTelefone: item.cliente_whatsapp,
        barbeiroNome: item.barbeiro_nome,
        servicosNomes: ['Corte / Barba'],
        valorTotal: 0,
        dataHoraInicio: item.data_hora_inicio,
        duracaoMinutos: 60,
      }),
    }));
  } catch (error) {
    console.error('Erro ao listar agendamentos no SQL Server:', error);
    return [];
  }
}

export async function atualizarStatusAgendamento(
  id: number,
  status: 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado' | 'Faltou'
): Promise<boolean> {
  try {
    const rows = await querySql<{ afetados: number }>(
      'SET NOCOUNT ON; UPDATE Agendamentos SET status = ? WHERE id = ?; SELECT @@ROWCOUNT AS afetados;',
      [status, id]
    );
    return Boolean(rows && rows[0] && rows[0].afetados > 0);
  } catch (error) {
    console.error('Erro ao atualizar status no SQL Server:', error);
    return false;
  }
}
