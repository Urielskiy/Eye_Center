import type {NextConfig} from 'next';

// Get the GitHub repository name from environment or default to 'Eye_Center'
const repoName = process.env.GITHUB_REPOSITORY_NAME || 'Eye_Center';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure for GitHub Pages
  output: 'export',
  // Configure basePath and assetPrefix for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
