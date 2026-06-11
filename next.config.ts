import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "apis.dojoconnect.app"],
    // If you need more flexible matching, use `remotePatterns`:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
