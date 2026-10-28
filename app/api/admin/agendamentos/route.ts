import { NextRequest, NextResponse } from 'next/server';
import { listarAgendamentosAdmin, atualizarStatusAgendamento } from '@/lib/repository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barbeiroIdStr = searchParams.get('barbeiroId');
    const barbeiroId = barbeiroIdStr && barbeiroIdStr !== 'null' ? parseInt(barbeiroIdStr, 10) : undefined;

    const lista = await listarAgendamentosAdmin(barbeiroId);
    return NextResponse.json(lista, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id e status são obrigatórios.' }, { status: 400 });
    }

    const sucesso = await atualizarStatusAgendamento(Number(id), status);
    if (!sucesso) {
      return NextResponse.json({ error: 'Agendamento não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
