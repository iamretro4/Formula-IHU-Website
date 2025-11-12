import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get password from environment variable (server-side only)
    const correctPassword = process.env.STUDIO_PASSWORD || 'admin';
    
    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure HTTP-only cookie
      response.cookies.set('studio_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const isAuthenticated = request.cookies.get('studio_authenticated')?.value === 'true';
  return NextResponse.json({ authenticated: isAuthenticated });
}

