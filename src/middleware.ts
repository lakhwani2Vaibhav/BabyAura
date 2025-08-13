import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];
 
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }
 
  // In a real app, you'd verify the JWT here.
  // For this demo, we'll assume the token is valid if it exists.
 
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/admin/:path*', '/api/doctor/:path*', '/api/parent/:path*'],
}
