import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  allowedDevOrigins: ["127.0.0.1", "localhost", "172.30.0.2"],
  async redirects() {
    return [
      {
        source: "/memorandum",
        destination: "/dashboard/memorandum",
        permanent: false,
      },
      {
        source: "/memorandum/baru",
        destination: "/dashboard/memorandum/new",
        permanent: false,
      },
      {
        source: "/dashboard/memorandum/baru",
        destination: "/dashboard/memorandum/new",
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
