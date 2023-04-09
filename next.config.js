// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['bcrypt', 'spark-md5'],
  },
  // swcMinify: true,
  images: {
    domains: [
      'gcdp.oss-cn-qingdao.aliyuncs.com',
      'yxg-image.oss-cn-qingdao.aliyuncs.com',
    ],
  },
};

https: module.exports = nextConfig;
