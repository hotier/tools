"use client";

import Link from "next/link";
import { useRecentTools } from "@/components/RecentToolsContext";

export default function RecentPage() {
  const { recentTools, clearRecentTools } = useRecentTools();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">最近使用</h1>
        {recentTools.length > 0 && (
          <button
            onClick={clearRecentTools}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            清空记录
          </button>
        )}
      </div>

      {recentTools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无使用记录</p>
          <p className="text-sm text-muted-foreground mt-2">使用工具后，记录会显示在这里</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
            >
              <h2 className="font-semibold mb-1">{tool.label}</h2>
              <p className="text-muted-foreground text-sm">{tool.category}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
