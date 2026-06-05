import type { NextConfig } from "next";

/** Assignment MFE zone. All routes/assets under /assignments. */
const nextConfig: NextConfig = {
  basePath: "/assignments",
  assetPrefix: "/assignments",
  transpilePackages: ["@lms/ui", "@lms/api-client"],
};

export default nextConfig;
