/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Next.js 15에서 청크 로딩 문제 해결을 위한 설정
  experimental: {
    // 청크 로딩 최적화
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  // 웹팩 설정으로 청크 로딩 문제 해결
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // 청크 이름 설정으로 캐싱 문제 해결
    config.output.chunkFilename = isServer
      ? "static/chunks/[id].js"
      : "static/chunks/[name].[chunkhash].js";

    return config;
  },
  // PDF 생성 관련 헤더 설정
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
