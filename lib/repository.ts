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

export function parseLocalDateTime(str: string): Date {
  // Se terminar com Z (UTC ISO), new Date(str) já converte para hora local nos getters
  if (str.endsWith('Z')) {
    return new Date(str);
  }
  // Formato "YYYY-MM-DDTHH:mm:ss" ou "YYYY-MM-DD HH:mm:ss"
  const clean = str.replace('T', ' ').trim();
  const [datePart, timePart = '00:00:00'] = clean.split(' ');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh = 0, mm = 0, ss = 0] = timePart.split(':').map(v => parseInt(v, 10));
  return new Date(y, m - 1, d, hh, mm, ss || 0);
}

// -------------------------------------------------------------
// SERVIÇOS E BARBEIROS (DIRETO DO SQL SERVER)
// -------------------------------------------------------------
export async function getServicos(): Promise<Servico[]> {
  try {
    const rows = await querySql<Servico>(
      'SELECT id, nome, categoria, CAST(preco AS FLOAT) as preco, duracao_min, ativo FROM Servicos WHERE ativo = 1 ORDER BY categoria, nome'
    );
    return rows;
  } catch (error) {
    console.error('Falha ao buscar serviços no SQL Server:', error);
    return [];
  }
}

export async function getBarbeiros(): Promise<Barbeiro[]> {
  try {
    const rows = await querySql<Barbeiro>(
      'SELECT id, nome, foto_url, bio, ativo FROM Barbeiros WHERE ativo = 1 ORDER BY id'
    );
    return rows;
  } catch (error) {
    console.error('Falha ao buscar barbeiros no SQL Server:', error);
    return [];
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
    ? barbeiros.filter(b => b.id === barbeiroId)
    : barbeiros;

  const todosAgendamentos = await getAgendamentosDoDia(dataStr);

  const agora = new Date();
  const toleranciaLimpezaMin = 10; // 10 min de intervalo confirmado pelo cliente
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
        const slotFimTempo = slotFim.getTime();

        return (slotInicioTempo < agFimComTolerancia && slotFimTempo > agInicio);
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
      WHERE CONVERT(varchar(10), a.data_hora_inicio, 23) = ?
        AND a.status <> 'Cancelado'
    `;
    const rows = await querySql<AgendamentoItem>(sqlQuery, [dataStr]);
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
}> {
  const telLimpo = input.clienteWhatsapp.replace(/\D/g, '');
  if (telLimpo.length < 10 || telLimpo.length > 11) {
    return { sucesso: false, erro: 'Telefone inválido. Informe o DDD e o número com 10 ou 11 dígitos.' };
  }

  const todosServicos = await getServicos();
  const servicosEscolhidos = todosServicos.filter(s => input.servicosIds.includes(s.id));
  if (servicosEscolhidos.length === 0) {
    return { sucesso: false, erro: 'Selecione ao menos um serviço para agendar.' };
  }

  const duracaoTotalMin = servicosEscolhidos.reduce((acc, s) => acc + s.duracao_min, 0);
  const valorTotal = servicosEscolhidos.reduce((acc, s) => acc + s.preco, 0);

  const dtInicio = parseLocalDateTime(input.dataHoraInicio);
  const dtFim = new Date(dtInicio.getTime() + duracaoTotalMin * 60000);
  const dataDiaStr = formatLocalDateOnly(dtInicio);

  const barbeiros = await getBarbeiros();
  const todosAgendamentosDia = await getAgendamentosDoDia(dataDiaStr);
  const toleranciaLimpezaMin = 10;

  let barbeiroFinal: Barbeiro | null = null;
  const candidatos = input.barbeiroId
    ? barbeiros.filter(b => Number(b.id) === Number(input.barbeiroId))
    : barbeiros;

  let menorCarga = Infinity;
  for (const b of candidatos) {
    const conflito = todosAgendamentosDia.some(ag => {
      if (Number(ag.barbeiro_id) !== Number(b.id) || ag.status === 'Cancelado') return false;
      const agIni = parseLocalDateTime(ag.data_hora_inicio).getTime();
      const agFimTolerancia = parseLocalDateTime(ag.data_hora_fim).getTime() + (toleranciaLimpezaMin * 60000);
      return (dtInicio.getTime() < agFimTolerancia && dtFim.getTime() > agIni);
    });

    if (!conflito) {
      const carga = todosAgendamentosDia.filter(ag => Number(ag.barbeiro_id) === Number(b.id) && ag.status !== 'Cancelado').length;
      if (carga < menorCarga) {
        menorCarga = carga;
        barbeiroFinal = b;
      }
    }
  }

  if (!barbeiroFinal) {
    return { sucesso: false, erro: 'O horário selecionado já está ocupado para este barbeiro. Por favor, escolha outro horário.' };
  }

  try {
    // 1. Cadastrar ou obter cliente
    const clienteRows = await querySql<{ id: number }>('SELECT id FROM Clientes WHERE whatsapp = ?', [telLimpo]);
    let clienteId: number;

    if (clienteRows.length > 0) {
      clienteId = clienteRows[0].id;
      await querySql('UPDATE Clientes SET nome = ? WHERE id = ?', [input.clienteNome, clienteId]);
    } else {
      const novoCli = await querySql<{ id: number }>(
        'INSERT INTO Clientes (nome, whatsapp) OUTPUT INSERTED.id VALUES (?, ?)',
        [input.clienteNome, telLimpo]
      );
      clienteId = novoCli[0].id;
    }

    // 2. Formatar data em horário local para SQL Server (YYYY-MM-DD HH:mm:ss)
    const dtInicioSql = formatLocalSqlDateTime(dtInicio);
    const dtFimSql = formatLocalSqlDateTime(dtFim);
    const dtInicioIsoLocal = formatLocalIsoDateTime(dtInicio);
    const dtFimIsoLocal = formatLocalIsoDateTime(dtFim);

    // 3. Inserir Agendamento no SQL Server
    const novoAgendamento = await querySql<{ id: number }>(
      `INSERT INTO Agendamentos (cliente_id, barbeiro_id, data_hora_inicio, data_hora_fim, status, observacao)
       OUTPUT INSERTED.id
       VALUES (?, ?, ?, ?, 'Pendente', ?)`,
      [clienteId, barbeiroFinal.id, dtInicioSql, dtFimSql, input.observacao || null]
    );

    const agendamentoId = novoAgendamento[0].id;

    // 4. Inserir Serviços do Agendamento (relação N:N com histórico de preço e duração)
    for (const s of servicosEscolhidos) {
      await querySql(
        `INSERT INTO AgendamentoServicos (agendamento_id, servico_id, preco_historico, duracao_historico)
         VALUES (?, ?, ?, ?)`,
        [agendamentoId, s.id, s.preco, s.duracao_min]
      );
    }

    // 5. Gerar link do Google Calendar
    const calendarUrl = generateGoogleCalendarUrl({
      titulo: `Barbearia Val: ${servicosEscolhidos.map(s => s.nome).join(' + ')}`,
      clienteNome: input.clienteNome,
      clienteTelefone: telLimpo,
      barbeiroNome: barbeiroFinal.nome,
      servicosNomes: servicosEscolhidos.map(s => s.nome),
      valorTotal,
      dataHoraInicio: dtInicioIsoLocal,
      duracaoMinutos: duracaoTotalMin
    });

    return {
      sucesso: true,
      agendamento: {
        id: agendamentoId,
        cliente_id: clienteId,
        cliente_nome: input.clienteNome,
        cliente_whatsapp: telLimpo,
        barbeiro_id: barbeiroFinal.id,
        barbeiro_nome: barbeiroFinal.nome,
        data_hora_inicio: dtInicioIsoLocal,
        data_hora_fim: dtFimIsoLocal,
        status: 'Pendente',
        observacao: input.observacao,
        servicos: servicosEscolhidos,
        valor_total: valorTotal,
        duracao_total: duracaoTotalMin,
        google_calendar_url: calendarUrl
      }
    };
  } catch (error: any) {
    console.error('Erro ao gravar agendamento no SQL Server:', error);
    return { sucesso: false, erro: 'Falha ao registrar agendamento no banco SQL Server: ' + error.message };
  }
}

// -------------------------------------------------------------
// LISTAGEM ADMIN & STATUS NO SQL SERVER
// -------------------------------------------------------------
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
        duracaoMinutos: 60
      })
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
    await querySql('UPDATE Agendamentos SET status = ? WHERE id = ?', [status, id]);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status no SQL Server:', error);
    return false;
  }
}
