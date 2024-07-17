import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware()

//default Clerk middleware, taken straight from docs
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};