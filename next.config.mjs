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
        source: '/admin/:path*',
        destination: 'http://1.224.162.188:58761/admin/:path*',
      },
      {
        source: '/v1/api/git/:path*',
        destination: 'http://1.224.162.188:58080/v1/api/git/:path*',
      },
      {
        source: '/api/vault/key',
        destination: 'http://1.224.162.188:58080/api/vault/key',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://1.224.162.188:58081/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
