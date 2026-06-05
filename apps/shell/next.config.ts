import type { NextConfig } from "next";

/**
 * Shell = the HOST app of the Multi-Zones setup. It owns the root origin
 * (http://localhost:3000) and rewrites path prefixes to each MFE zone.
 *
 * Each zone runs as its own Next.js app on its own port. A request to
 * /courses/anything is transparently proxied to the catalog zone, which is
 * configured with basePath "/courses" so its internal routes line up.
 *
 * Zones are commented out until each MFE is scaffolded — the shell runs
 * standalone right now. Uncomment a block when you build that MFE.
 */

const zone = (name: string, fallbackPort: number) =>
  process.env[`ZONE_${name}_URL`] ?? `http://localhost:${fallbackPort}`;

const nextConfig: NextConfig = {
  transpilePackages: ["@lms/ui", "@lms/api-client"],
  async rewrites() {
    return [
      // --- Feature MFE zones (enable as each is built) ---
      { source: "/auth/:path*", destination: `${zone("AUTH", 3001)}/auth/:path*` },
      { source: "/courses/:path*", destination: `${zone("CATALOG", 3002)}/courses/:path*` },
      { source: "/learn/:path*", destination: `${zone("LEARNING", 3003)}/learn/:path*` },
      { source: "/assignments/:path*", destination: `${zone("ASSIGN", 3004)}/assignments/:path*` },
      { source: "/dashboard/:path*", destination: `${zone("DASHBOARD", 3005)}/dashboard/:path*` },
      { source: "/admin/:path*", destination: `${zone("ADMIN", 3006)}/admin/:path*` },
    ];
  },
};

export default nextConfig;
