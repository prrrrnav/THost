/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // ⭐ VERY IMPORTANT
  images: {
    unoptimized: true,       // Required for GitHub Pages
  },
  basePath: "/THost", // IMPORTANT
  assetPrefix: "/THost/",
};

module.exports = nextConfig;