// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to /api/upload route
  if (request.nextUrl.pathname.startsWith('/api/upload')) {
    // For OPTIONS requests (CORS preflight), return 200 with appropriate headers
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Check if the request is a POST request
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Don't strictly check content type as it might include boundary information
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data') && !contentType.includes('boundary')) {
      console.log('Invalid content type:', contentType);
      // Just log the error but don't block the request
      // This allows the API route to handle the error more gracefully
    }
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Define the paths that this middleware should run on
export const config = {
  matcher: ['/api/upload', '/api/files/:path*'],
};