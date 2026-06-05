import type { NextConfig } from "next";

/** Course Catalog MFE zone. All routes/assets under /courses. */
const nextConfig: NextConfig = {
  basePath: "/courses",
  assetPrefix: "/courses",
  transpilePackages: ["@lms/ui", "@lms/api-client"],
};

export default nextConfig;
