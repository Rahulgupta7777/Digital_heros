import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { runDraw } from '@/lib/draw-engine';
import { monthKey } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

    if (!authHeader || authHeader !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();
    const month = monthKey(new Date());

    const result = await runDraw(admin, {
      monthIso: month,
      mode: 'random',
      publish: true,
    });

    return NextResponse.json({
      success: true,
      draw: result,
      message: `Draw executed for ${month}`,
    });
  } catch (error: unknown) {
    console.error('Draw execution error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute draw';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const preferredRegion = 'iad1';
