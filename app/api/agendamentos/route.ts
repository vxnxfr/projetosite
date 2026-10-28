import { NextRequest, NextResponse } from 'next/server';
import { criarAgendamento } from '@/lib/repository';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Proteção contra spam de agendamentos (máximo 12 agendamentos por minuto por IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'local-client';
    const rateCheck = checkRateLimit(`booking_${ip}`, 12, 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json({
        error: 'Muitas tentativas de agendamento em sequência. Por favor, aguarde um instante e tente novamente.'
      }, { status: 429 });
    }

    const body = await request.json();

    if (!body.clienteNome || !body.clienteWhatsapp || !body.dataHoraInicio || !body.servicosIds || !body.servicosIds.length) {
      return NextResponse.json({
        error: 'Campos obrigatórios: clienteNome, clienteWhatsapp, dataHoraInicio e servicosIds.'
      }, { status: 400 });
    }

    const resultado = await criarAgendamento({
      clienteNome: body.clienteNome.trim(),
      clienteWhatsapp: body.clienteWhatsapp.trim(),
      barbeiroId: body.barbeiroId ? parseInt(body.barbeiroId, 10) : null,
      servicosIds: body.servicosIds.map(Number),
      dataHoraInicio: body.dataHoraInicio,
      observacao: body.observacao?.trim()
    });

    if (!resultado.sucesso) {
      return NextResponse.json({ error: resultado.erro }, { status: 409 });
    }

    return NextResponse.json(resultado.agendamento, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

