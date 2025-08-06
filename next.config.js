/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
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

// Only apply basePath and assetPrefix for production builds (not in local development)
if (process.env.NODE_ENV === 'production') {
  // Настройка базового пути для GitHub Pages
  nextConfig.basePath = '/Eye_Center';
  nextConfig.assetPrefix = '/Eye_Center/';
}

module.exports = nextConfig;
