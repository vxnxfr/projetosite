import { NextRequest, NextResponse } from 'next/server';
import { buscarAgendamentosDoDiaParaLembrete, dispararLembretesWhatsapp } from '@/lib/lembretes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isAuthorized(request: NextRequest): boolean {
  const expectedKey = process.env.ADMIN_KEY || 'val-admin-2026';
  const headerKey = request.headers.get('x-admin-key');
  const cronSecret = request.headers.get('x-cron-secret');
  return headerKey === expectedKey || cronSecret === expectedKey;
}

/**
 * GET: Consulta a lista de lembretes pendentes de envio hoje (ou na data informada ?data=YYYY-MM-DD).
 */
export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dataAlvo = searchParams.get('data') || undefined;

    const lembretes = await buscarAgendamentosDoDiaParaLembrete(dataAlvo);
    return NextResponse.json(lembretes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Dispara os lembretes do dia via API ou prepara os links de disparo.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    let dataAlvo: string | undefined = undefined;
    try {
      const body = await request.json();
      if (body?.data) dataAlvo = body.data;
    } catch {
      // Sem body
    }

    const resultado = await dispararLembretesWhatsapp(dataAlvo);
    return NextResponse.json(resultado);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

