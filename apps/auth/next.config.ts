import type { NextConfig } from "next";

/**
 * Auth MFE zone. basePath + assetPrefix = "/auth" so every route and asset
 * lives under /auth, matching the shell's rewrite. Runs standalone on :3001
 * (visit http://localhost:3001/auth/login) or via the shell at /auth/login.
 */
const nextConfig: NextConfig = {
  basePath: "/auth",
  assetPrefix: "/auth",
  transpilePackages: ["@lms/ui", "@lms/api-client"],
};

export default nextConfig;
