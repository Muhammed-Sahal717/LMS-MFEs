import type { NextConfig } from "next";

/** Dashboard MFE zone. All routes/assets under /dashboard. */
const nextConfig: NextConfig = {
  basePath: "/dashboard",
  assetPrefix: "/dashboard",
  transpilePackages: ["@lms/ui", "@lms/api-client"],
};

export default nextConfig;
