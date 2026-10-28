import { NextResponse } from 'next/server';
import { getServicos } from '@/lib/repository';

export async function GET() {
  try {
    const servicos = await getServicos();
    return NextResponse.json(servicos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

