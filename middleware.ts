import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export function middleware(request: NextRequest) {
  // Add paths that require authentication
  const protectedPaths = ['/dashboard', '/profile'];
  
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    const user = verifyAuth(request);
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}