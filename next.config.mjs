/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "http://1.224.162.188:58761/:path*",
      },
      {
        source: "/vi/api/git/:path*",
        destination: "http://192.168.123.102:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
