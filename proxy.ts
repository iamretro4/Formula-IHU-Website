import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to API routes, admin routes, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/registration-tests/admin') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check if quiz is active and should lock the site
  // Only check if not already on quiz or admin pages
  if (pathname !== '/registration-tests' && 
      !pathname.startsWith('/registration-tests/admin') &&
      !pathname.startsWith('/studio') &&
      !pathname.startsWith('/api')) {
    try {
      // Fetch quiz configuration from Sanity API directly (proxy can't use client)
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
      const apiToken = process.env.SANITY_API_TOKEN;
      
      if (projectId && apiToken) {
        const query = encodeURIComponent('*[_type == "registrationQuiz" && isActive == true][0]{scheduledStartTime}');
        
        // Use AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        try {
          const response = await fetch(
            `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=${query}`,
            {
              headers: {
                'Authorization': `Bearer ${apiToken}`,
              },
              signal: controller.signal,
              next: { revalidate: 30 }, // Revalidate every 30 seconds (optimized)
            }
          );

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const quiz = data.result;

            if (quiz && quiz.scheduledStartTime) {
              const now = new Date();
              const startTime = new Date(quiz.scheduledStartTime);
              const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Fixed 2 hours duration

              // If current time is between start and end time, redirect to quiz
              if (now >= startTime && now <= endTime) {
                return NextResponse.redirect(new URL('/registration-tests', request.url));
              }
            }
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          // Silently fail - allow navigation to continue
          if (fetchError.name !== 'AbortError') {
            // Only log non-timeout errors
          }
        }
      }
    } catch (error) {
      // If there's an error fetching quiz config, allow normal navigation
      // Don't log in production to avoid noise
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

