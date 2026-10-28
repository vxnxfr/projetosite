import { NextRequest, NextResponse } from 'next/server';
import { getHorariosLivres, isValidDateStr } from '@/lib/repository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data'); // YYYY-MM-DD
    const duracaoStr = searchParams.get('duracao');
    const barbeiroIdStr = searchParams.get('barbeiro_id') || searchParams.get('barbeiroId');

    if (!data || !isValidDateStr(data)) {
      return NextResponse.json(
        { error: 'Parâmetro data é obrigatório e deve ser uma data válida no formato YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    let duracao = 60;
    if (duracaoStr !== null && duracaoStr !== '') {
      if (!/^\d+$/.test(duracaoStr)) {
        return NextResponse.json({ error: 'Parâmetro duracao inválido.' }, { status: 400 });
      }
      duracao = parseInt(duracaoStr, 10);
      if (duracao < 10 || duracao > 480) {
        return NextResponse.json({ error: 'A duração deve estar entre 10 e 480 minutos.' }, { status: 400 });
      }
    }

    let barbeiroId: number | null = null;
    if (barbeiroIdStr && barbeiroIdStr !== 'null') {
      if (!/^\d+$/.test(barbeiroIdStr)) {
        return NextResponse.json({ error: 'Parâmetro barbeiroId inválido.' }, { status: 400 });
      }
      barbeiroId = parseInt(barbeiroIdStr, 10);
      if (barbeiroId <= 0) {
        return NextResponse.json({ error: 'Parâmetro barbeiroId inválido.' }, { status: 400 });
      }
    }

    const slots = await getHorariosLivres(data, duracao, barbeiroId);
    return NextResponse.json(slots, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
