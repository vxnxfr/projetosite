// =====================================================================
// Barbearia Val - Bot do WhatsApp para Lembretes no Dia do Corte
// =====================================================================

import { querySql } from './db';
import { AgendamentoItem, LembreteDisparoResult } from './types';
import { formatLocalDateOnly } from './repository';

/**
 * Monta o texto oficial do lembrete de agendamento no WhatsApp.
 */
export function formatarMensagemLembrete(agendamento: {
  clienteNome: string;
  barbeiroNome: string;
  servicosNomes: string;
  horaInicio: string;
  data: string;
}): string {
  return [
    `💈 *Barbearia Val — Lembrete de Agendamento* 💈`,
    ``,
    `Olá, *${agendamento.clienteNome}*! Tudo bem?`,
    `Passando para lembrar do seu horário marcado hoje com a gente:`,
    ``,
    `✂️ *Serviço:* ${agendamento.servicosNomes}`,
    `👤 *Barbeiro:* ${agendamento.barbeiroNome}`,
    `⏰ *Horário:* ${agendamento.horaInicio}`,
    `📍 *Local:* Av. Adutora, 530 - Jardim Nova Poá, Poá - SP`,
    ``,
    `Pedimos que chegue com 5 minutos de antecedência.`,
    `Caso precise reagendar ou tenha algum imprevisto, favor nos avisar respondendo esta mensagem.`,
    ``,
    `Te esperamos! ✂️💈`
  ].join('\n');
}

/**
 * Busca todos os agendamentos de uma data específica que precisam de lembrete (status Pendente ou Confirmado).
 */
export async function buscarAgendamentosDoDiaParaLembrete(dataAlvo?: string): Promise<{
  id: number;
  cliente_nome: string;
  cliente_whatsapp: string;
  barbeiro_nome: string;
  servicos_nomes: string;
  hora_inicio: string;
  data_formatada: string;
  status: string;
  link_whatsapp: string;
  mensagem: string;
}[]> {
  const dataHoje = dataAlvo || formatLocalDateOnly(new Date());

  const query = `
    SELECT 
      a.id,
      c.nome AS cliente_nome,
      c.whatsapp AS cliente_whatsapp,
      b.nome AS barbeiro_nome,
      CONVERT(varchar(5), a.data_hora_inicio, 108) AS hora_inicio,
      CONVERT(varchar(10), a.data_hora_inicio, 103) AS data_formatada,
      a.status,
      STRING_AGG(s.nome, ' + ') AS servicos_nomes
    FROM Agendamentos a
    JOIN Clientes c ON a.cliente_id = c.id
    JOIN Barbeiros b ON a.barbeiro_id = b.id
    LEFT JOIN AgendamentoServicos ags ON a.id = ags.agendamento_id
    LEFT JOIN Servicos s ON ags.servico_id = s.id
    WHERE a.data_hora_inicio >= CONVERT(datetime, ?, 120)
      AND a.data_hora_inicio < DATEADD(day, 1, CONVERT(datetime, ?, 120))
      AND a.status IN ('Pendente', 'Confirmado')
    GROUP BY 
      a.id, c.nome, c.whatsapp, b.nome, a.data_hora_inicio, a.status
    ORDER BY a.data_hora_inicio ASC
  `;

  const inicioDia = `${dataHoje} 00:00:00`;
  const rows = await querySql<any>(query, [inicioDia, inicioDia]);

  return rows.map(r => {
    const telLimpo = (r.cliente_whatsapp || '').replace(/\D/g, '');
    const telCompleto = telLimpo.startsWith('55') ? telLimpo : `55${telLimpo}`;
    const servicosStr = r.servicos_nomes || 'Corte / Barba';

    const msg = formatarMensagemLembrete({
      clienteNome: r.cliente_nome,
      barbeiroNome: r.barbeiro_nome,
      servicosNomes: servicosStr,
      horaInicio: r.hora_inicio,
      data: r.data_formatada
    });

    const linkWhatsapp = `https://wa.me/${telCompleto}?text=${encodeURIComponent(msg)}`;

    return {
      id: r.id,
      cliente_nome: r.cliente_nome,
      cliente_whatsapp: r.cliente_whatsapp,
      barbeiro_nome: r.barbeiro_nome,
      servicos_nomes: servicosStr,
      hora_inicio: r.hora_inicio,
      data_formatada: r.data_formatada,
      status: r.status,
      link_whatsapp: linkWhatsapp,
      mensagem: msg
    };
  });
}

/**
 * Dispara os lembretes do dia para os clientes.
 * Se houver webhook/API de WhatsApp configurada (ex: Evolution API, Z-API, Twilio),
 * realiza a chamada HTTP POST. Caso contrário, gera os links prontos de WhatsApp Web para 1-clique.
 */
export async function dispararLembretesWhatsapp(dataAlvo?: string): Promise<LembreteDisparoResult> {
  const agendamentos = await buscarAgendamentosDoDiaParaLembrete(dataAlvo);
  const apiUrl = process.env.WHATSAPP_API_URL; // Ex: https://api.z-api.io/instances/.../messages/text
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  let enviados = 0;
  let falhas = 0;
  const detalhes: LembreteDisparoResult['detalhes'] = [];

  for (const ag of agendamentos) {
    const telLimpo = (ag.cliente_whatsapp || '').replace(/\D/g, '');
    const telCompleto = telLimpo.startsWith('55') ? telLimpo : `55${telLimpo}`;

    if (apiUrl && apiToken) {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          },
          body: JSON.stringify({
            phone: telCompleto,
            message: ag.mensagem
          })
        });

        if (res.ok) {
          enviados++;
          detalhes.push({
            agendamentoId: ag.id,
            clienteNome: ag.cliente_nome,
            clienteWhatsapp: ag.cliente_whatsapp,
            hora: ag.hora_inicio,
            status: 'enviado',
            mensagem: ag.mensagem,
            linkWhatsapp: ag.link_whatsapp
          });
        } else {
          falhas++;
          detalhes.push({
            agendamentoId: ag.id,
            clienteNome: ag.cliente_nome,
            clienteWhatsapp: ag.cliente_whatsapp,
            hora: ag.hora_inicio,
            status: 'falha',
            mensagem: `Erro na API do WhatsApp: HTTP ${res.status}`,
            linkWhatsapp: ag.link_whatsapp
          });
        }
      } catch (err: any) {
        falhas++;
        detalhes.push({
          agendamentoId: ag.id,
          clienteNome: ag.cliente_nome,
          clienteWhatsapp: ag.cliente_whatsapp,
          hora: ag.hora_inicio,
          status: 'falha',
          mensagem: err.message,
          linkWhatsapp: ag.link_whatsapp
        });
      }
    } else {
      // Modo Simulado / 1-clique (pronto para envio manual imediato)
      enviados++;
      detalhes.push({
        agendamentoId: ag.id,
        clienteNome: ag.cliente_nome,
        clienteWhatsapp: ag.cliente_whatsapp,
        hora: ag.hora_inicio,
        status: 'simulado',
        mensagem: ag.mensagem,
        linkWhatsapp: ag.link_whatsapp
      });
    }
  }

  return {
    total: agendamentos.length,
    enviados,
    falhas,
    detalhes
  };
}

