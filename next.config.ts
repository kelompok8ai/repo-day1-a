import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      {
        source: "/memorandum",
        destination: "/dashboard/memorandum",
        permanent: false,
      },
      {
        source: "/memorandum/baru",
        destination: "/dashboard/memorandum/baru",
        permanent: false,
      },
      {
        source: "/memorandum/:id",
        destination: "/dashboard/memorandum/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
