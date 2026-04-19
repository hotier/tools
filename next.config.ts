import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 对热门工具页面设置缓存头
        source: "/popular",
        headers: [
          {
            key: "Cache-Control",
            // 设置 CDN 缓存时间为 1 小时，与 ISR revalidate 时间一致
            // stale-while-revalidate 允许在后台更新缓存的同时提供旧内容
            value: "s-maxage=3600, stale-while-revalidate"
          }
        ]
      },
      {
        // 对 API 路由禁用缓存
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
