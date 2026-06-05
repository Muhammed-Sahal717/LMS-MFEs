import type { NextConfig } from "next";

/** Admin MFE zone. All routes/assets under /admin. */
const nextConfig: NextConfig = {
  basePath: "/admin",
  assetPrefix: "/admin",
  transpilePackages: ["@lms/ui", "@lms/api-client"],
};

export default nextConfig;
