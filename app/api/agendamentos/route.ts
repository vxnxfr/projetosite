import { NextRequest, NextResponse } from 'next/server';
import { criarAgendamento } from '@/lib/repository';
import { checkRateLimit } from '@/lib/rateLimit';
import { enviarEmailConfirmacao } from '@/lib/email';
import { sincronizarGoogleCalendarBarbeiro } from '@/lib/googleCalendarSync';

export async function POST(request: NextRequest) {
  try {
    // Proteção contra spam de agendamentos (máximo 12 agendamentos por minuto por IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'local-client';
    const rateCheck = checkRateLimit(`booking_${ip}`, 12, 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Muitas tentativas de agendamento em sequência. Por favor, aguarde um instante e tente novamente.',
        },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Corpo da requisição JSON inválido.' }, { status: 400 });
    }

    if (
      !body ||
      typeof body !== 'object' ||
      typeof body.clienteNome !== 'string' ||
      typeof body.clienteWhatsapp !== 'string' ||
      typeof body.dataHoraInicio !== 'string' ||
      !Array.isArray(body.servicosIds) ||
      body.servicosIds.length === 0
    ) {
      return NextResponse.json(
        {
          error: 'Campos obrigatórios inválidos: clienteNome, clienteWhatsapp, dataHoraInicio e servicosIds (lista).',
        },
        { status: 400 }
      );
    }

    if (body.observacao !== undefined && body.observacao !== null && typeof body.observacao !== 'string') {
      return NextResponse.json({ error: 'Campo observacao inválido.' }, { status: 400 });
    }

    let clienteEmail: string | undefined = undefined;
    if (body.clienteEmail !== undefined && body.clienteEmail !== null) {
      const emailRaw = String(body.clienteEmail).trim();
      if (emailRaw.length > 0) {
        if (emailRaw.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
          return NextResponse.json({ error: 'E-mail informado é inválido.' }, { status: 400 });
        }
        clienteEmail = emailRaw.toLowerCase();
      }
    }

    let barbeiroId: number | null = null;
    if (body.barbeiroId !== undefined && body.barbeiroId !== null && body.barbeiroId !== '') {
      const parsedBarbeiro = Number(body.barbeiroId);
      if (!Number.isInteger(parsedBarbeiro) || parsedBarbeiro <= 0) {
        return NextResponse.json({ error: 'Barbeiro selecionado inválido.' }, { status: 400 });
      }
      barbeiroId = parsedBarbeiro;
    }

    const resultado = await criarAgendamento({
      clienteNome: body.clienteNome,
      clienteWhatsapp: body.clienteWhatsapp,
      clienteEmail,
      barbeiroId,
      servicosIds: body.servicosIds,
      dataHoraInicio: body.dataHoraInicio,
      observacao: body.observacao,
    });

    if (!resultado.sucesso) {
      return NextResponse.json({ error: resultado.erro }, { status: resultado.statusCode || 409 });
    }

    const agendamento = resultado.agendamento!;

    // 1. Enviar e-mail de confirmação (se informado) com convite iCalendar (.ics) integrado
    if (clienteEmail) {
      enviarEmailConfirmacao({
        agendamentoId: agendamento.id,
        clienteNome: agendamento.cliente_nome,
        clienteEmail,
        clienteTelefone: agendamento.cliente_whatsapp,
        barbeiroNome: agendamento.barbeiro_nome,
        servicosNomes: agendamento.servicos?.map(s => s.nome) || ['Corte'],
        valorTotal: agendamento.valor_total || 0,
        duracaoMinutos: agendamento.duracao_total || 60,
        dataHoraInicio: agendamento.data_hora_inicio,
        dataHoraFim: agendamento.data_hora_fim,
        googleCalendarUrl: agendamento.google_calendar_url,
      }).catch(err => console.error('[Email Confirmacao Erro]', err));
    }

    // 2. Sincronizar Google Agenda do Barbeiro
    sincronizarGoogleCalendarBarbeiro({
      agendamentoId: agendamento.id,
      clienteNome: agendamento.cliente_nome,
      clienteTelefone: agendamento.cliente_whatsapp,
      clienteEmail,
      barbeiroNome: agendamento.barbeiro_nome,
      servicosNomes: agendamento.servicos?.map(s => s.nome) || ['Corte'],
      valorTotal: agendamento.valor_total || 0,
      dataHoraInicio: agendamento.data_hora_inicio,
      dataHoraFim: agendamento.data_hora_fim,
    }).catch(err => console.error('[Google Calendar Sync Erro]', err));

    return NextResponse.json(agendamento, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Erro interno no servidor.' }, { status: 500 });
  }
}
