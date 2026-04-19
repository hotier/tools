import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    
    revalidatePath(path);
    
    return NextResponse.json({ 
      revalidated: true, 
      path, 
      now: Date.now() 
    });
  } catch (error) {
    console.error('Error revalidating path:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate path' },
      { status: 500 }
    );
  }
}
