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
    const zoneRewrites = (path: string, name: string, port: number) => [
      { source: `${path}`, destination: `${zone(name, port)}${path}` },
      { source: `${path}/:path+`, destination: `${zone(name, port)}${path}/:path+` },
    ];

    return [
      // --- Feature MFE zones (enable as each is built) ---
      ...zoneRewrites("/auth", "AUTH", 3001),
      ...zoneRewrites("/courses", "CATALOG", 3002),
      ...zoneRewrites("/learn", "LEARNING", 3003),
      ...zoneRewrites("/assignments", "ASSIGN", 3004),
      ...zoneRewrites("/dashboard", "DASHBOARD", 3005),
      ...zoneRewrites("/admin", "ADMIN", 3006),
    ];
  },
};

export default nextConfig;
