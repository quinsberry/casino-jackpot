import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        typedEnv: true,
    },
    distDir: 'build',
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
