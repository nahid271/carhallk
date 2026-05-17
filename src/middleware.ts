import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match the root path explicitly so / redirects to /bn (the default locale),
  // and match every other path except API routes, Next internals, and files
  // with extensions (favicon, sitemap, robots, etc.).
  matcher: ['/', '/(bn|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
