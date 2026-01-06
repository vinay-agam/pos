import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  reactCompiler: true,
  basePath: isProd ? '/pos' : '',
  assetPrefix: isProd ? '/pos/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
