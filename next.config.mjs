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
        source: '/api/v1/apikey/:path*',
        destination: 'http://1.224.162.188:58081/api/v1/apikey/:path*',
      },
      {
        source: '/api/v1/access-token/:path*',
        destination: 'http://1.224.162.188:58081/api/v1/access-token/:path*',
      },
      {
        source: '/api/v1/code',
        destination: 'http://1.224.162.188:58081/api/v1/code',
      },
      {
        source: '/auth-callback',
        destination: 'http://1.224.162.188:58081/:path*',
      },
      {
        source: '/api/v1/organizations/:path*',
        destination: 'http://1.224.162.188:58083/api/v1/organizations/:path*',
      },
      {
        source: '/api/v1/permissions/:path*',
        destination: 'http://1.224.162.188:58083/api/v1/permissions/:path*',
      },
      {
        source: '/api/v1/role/:path*',
        destination: 'http://1.224.162.188:58083/api/v1/role/:path*',
      },
      {
        source: '/api/v1/roles/:path*',
        destination: 'http://1.224.162.188:58083/api/v1/roles/:path*',
      },
      {
        source: '/api/v1/role-permissions',
        destination: 'http://1.224.162.188:58083/api/v1/role-permissions',
      },
      {
        source: '/api/v1/users/:path*',
        destination: 'http://1.224.162.188:58083/api/v1/users/:path*',
      },
      {
        source: '/api/v1/plans/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/plans/:path*',
      },
      {
        source: '/api/v1/resources/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/resources/:path*',
      },
      {
        source: '/api/v1/methods/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/methods/:path*',
      },
      {
        source: '/api/v1/stages/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/stages/:path*',
      },
      {
        source: '/api/v1/models/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/models/:path*',
      },
      {
        source: '/api/v1/deployments/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/deployments/:path*',
      },
      {
        source: '/api/v1/target-endpoints/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/target-endpoints/:path*',
      },
      {
        source: '/api/v1/common-codes/:path*',
        destination: 'http://1.224.162.188:58084/api/v1/common-codes/:path*',
      },
      {
        source: '/api/v1/gateway/stage/:path*',
        destination: 'https://1.224.162.188:18082/api/v1/gateway/stage/:path*',
      },
    ];
  },
};

export default nextConfig;
