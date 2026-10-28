import { NextResponse } from 'next/server';
import { getBarbeiros } from '@/lib/repository';

export async function GET() {
  try {
    const barbeiros = await getBarbeiros();
    return NextResponse.json(barbeiros);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

