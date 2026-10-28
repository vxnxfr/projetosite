import { NextRequest, NextResponse } from 'next/server';
import { getHorariosLivres } from '@/lib/repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data'); // YYYY-MM-DD
    const duracaoStr = searchParams.get('duracao');
    const barbeiroIdStr = searchParams.get('barbeiroId');

    if (!data) {
      return NextResponse.json({ error: 'Parâmetro data é obrigatório (YYYY-MM-DD).' }, { status: 400 });
    }

    const duracao = duracaoStr ? parseInt(duracaoStr, 10) : 60;
    const barbeiroId = barbeiroIdStr && barbeiroIdStr !== 'null' ? parseInt(barbeiroIdStr, 10) : null;

    const slots = await getHorariosLivres(data, duracao, barbeiroId);
    return NextResponse.json(slots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

