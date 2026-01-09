import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  applySecurityHeaders,
  applyCORSHeaders,
  handleCORS,
} from '@/utils/security-headers';

const isPublicRoute = createRouteMatcher(['/', '/properties(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isApiRoute = createRouteMatcher(['/api(.*)']);

// Validate environment variables
const adminUserId = process.env.ADMIN_USER_ID;
if (!adminUserId && process.env.NODE_ENV === 'production') {
  console.error('⚠️  WARNING: ADMIN_USER_ID is not set in production environment');
}

export default clerkMiddleware((auth, req: NextRequest) => {
  const userId = auth().userId;
  const isAdminUser = userId === adminUserId;
  
  // Handle CORS preflight for API routes
  if (isApiRoute(req)) {
    const corsResponse = handleCORS(req);
    if (corsResponse) {
      return corsResponse;
    }
  }
  
  // Admin route protection
  if (isAdminRoute(req) && !isAdminUser) {
    const response = NextResponse.redirect(new URL('/', req.url));
    return applySecurityHeaders(response);
  }
  
  // Public route protection
  if (!isPublicRoute(req)) {
    auth().protect();
  }
  
  // Apply security headers to all responses
  const response = NextResponse.next();
  applySecurityHeaders(response);
  
  // Apply CORS headers for API routes
  if (isApiRoute(req)) {
    applyCORSHeaders(req, response);
  }
  
  return response;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
