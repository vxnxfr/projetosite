import { NextRequest, NextResponse } from 'next/server';
import { getBloqueios, criarBloqueio, removerBloqueio } from '@/lib/repository';

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

    const bloqueios = await getBloqueios();
    return NextResponse.json(bloqueios, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json({ error: 'Acesso não autorizado ao painel administrativo.' }, { status: 401 });
    }

    const body = await request.json();
    const { barbeiroId, dataHoraInicio, dataHoraFim, motivo } = body;

    if (!dataHoraInicio || !dataHoraFim) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: dataHoraInicio e dataHoraFim.' },
        { status: 400 }
      );
    }

    let parsedBarbeiroId: number | null = null;
    if (barbeiroId !== undefined && barbeiroId !== null && barbeiroId !== '' && barbeiroId !== 'todos') {
      const num = Number(barbeiroId);
      if (isNaN(num) || num <= 0) {
        return NextResponse.json({ error: 'ID do barbeiro inválido.' }, { status: 400 });
      }
      parsedBarbeiroId = num;
    }

    const resultado = await criarBloqueio(parsedBarbeiroId, dataHoraInicio, dataHoraFim, motivo);

    if (!resultado.sucesso) {
      return NextResponse.json({ error: resultado.erro }, { status: 400 });
    }

    return NextResponse.json({ sucesso: true, id: resultado.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json({ error: 'Acesso não autorizado ao painel administrativo.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // no body
      }
    }

    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: 'ID do bloqueio obrigatório e deve ser numérico.' }, { status: 400 });
    }

    const sucesso = await removerBloqueio(numId);
    if (!sucesso) {
      return NextResponse.json({ error: 'Bloqueio não encontrado ou já removido.' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

