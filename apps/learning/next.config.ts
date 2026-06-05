import type { NextConfig } from "next";

/** Learning MFE zone. All routes/assets under /learn. */
const nextConfig: NextConfig = {
  basePath: "/learn",
  assetPrefix: "/learn",
  transpilePackages: ["@lms/ui", "@lms/api-client"],
};

export default nextConfig;
