import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/',
    '/auth/sign-in', 
    '/auth/sign-up',
    '/about',
    '/contact',
    '/api/public/(.*)'
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    '/api/public/(.*)'
  ],
});

export const config = {
  // Skip middleware on static files and images
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 