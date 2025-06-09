/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Настройка базового пути для GitHub Pages
  basePath: '/Eye_Center',
  assetPrefix: '/Eye_Center/',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Basic configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
