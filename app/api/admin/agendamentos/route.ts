import { NextRequest, NextResponse } from 'next/server';
import {
  listarAgendamentosAdmin,
  atualizarStatusAgendamento,
  STATUS_AGENDAMENTO_VALIDOS,
} from '@/lib/repository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isAuthorizedAdmin(request: NextRequest): boolean {
  const expectedKey = process.env.ADMIN_KEY || 'val-admin-2026';
  const headerKey = request.headers.get('x-admin-key');
  return headerKey === expectedKey;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json({ error: 'Acesso não autorizado ao painel administrativo.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const barbeiroIdStr = searchParams.get('barbeiroId');
    let barbeiroId: number | undefined;

    if (barbeiroIdStr && barbeiroIdStr !== 'null') {
      if (!/^\d+$/.test(barbeiroIdStr)) {
        return NextResponse.json({ error: 'barbeiroId inválido.' }, { status: 400 });
      }
      barbeiroId = parseInt(barbeiroIdStr, 10);
    }

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
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json({ error: 'Acesso não autorizado ao painel administrativo.' }, { status: 401 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
    }

    const { id, status } = body || {};
    const numId = Number(id);

    if (!Number.isInteger(numId) || numId <= 0 || typeof status !== 'string') {
      return NextResponse.json({ error: 'id e status válidos são obrigatórios.' }, { status: 400 });
    }

    if (!STATUS_AGENDAMENTO_VALIDOS.includes(status as any)) {
      return NextResponse.json(
        { error: `Status inválido. Valores permitidos: ${STATUS_AGENDAMENTO_VALIDOS.join(', ')}` },
        { status: 400 }
      );
    }

    const sucesso = await atualizarStatusAgendamento(numId, status as any);
    if (!sucesso) {
      return NextResponse.json({ error: 'Agendamento não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
