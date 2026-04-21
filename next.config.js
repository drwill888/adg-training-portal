/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Subdomain routing for Called to Carry.
  // calledtocarry.awakeningdestiny.global/<path> → pages/called-to-carry/<path>
  // Excludes /api/, /_next/, /_vercel/, /favicon.ico so API routes and Next
  // internals pass through untouched. See called-to-carry-build-plan.md § Phase 1.3.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path((?!api/|_next/|_vercel/|favicon\\.ico).*)',
          has: [{ type: 'host', value: 'calledtocarry.awakeningdestiny.global' }],
          destination: '/called-to-carry/:path',
        },
      ],
    };
  },
};

module.exports = nextConfig;
