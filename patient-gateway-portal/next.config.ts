import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Veludaiyaan-Hospital";
const pagesBasePath = `/${repositoryName}`;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPagesBuild ? pagesBasePath : undefined,
  assetPrefix: isGitHubPagesBuild ? `${pagesBasePath}/` : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
