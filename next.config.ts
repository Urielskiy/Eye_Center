import type {NextConfig} from 'next';

// Get the GitHub repository name from environment or default to 'Eye_Center'
const repoName = process.env.GITHUB_REPOSITORY_NAME || 'Eye_Center';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  // Basic configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Export static HTML/CSS/JS
  output: 'export',
  
  // GitHub Pages configuration
  // Only apply basePath and assetPrefix in production
  basePath: '',
  assetPrefix: '',
  
  // Disable trailing slash
  trailingSlash: false,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Generate static 404 page
  distDir: 'out',
};

export default nextConfig;
