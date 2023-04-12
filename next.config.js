// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['bcrypt', 'spark-md5', 'multer'],
  },
  images: {
    domains: [
      'gcdp.oss-cn-qingdao.aliyuncs.com',
      'yxg-image.oss-cn-qingdao.aliyuncs.com',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

https: module.exports = nextConfig;
