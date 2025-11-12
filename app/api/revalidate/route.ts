import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  // Verify the secret token
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }

  try {
    // Revalidate all pages that use Sanity content
    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/sponsors');
    revalidatePath('/events');
    revalidatePath('/rules');
    revalidatePath('/posts');
    
    // Revalidate dynamic routes
    // Note: We can't revalidate specific dynamic paths without knowing them,
    // but revalidating the parent will help
    revalidatePath('/events/[year]', 'page');
    revalidatePath('/posts/[slug]', 'page');
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'All pages revalidated successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

