"use client";

import { useRecentTools } from "@/components/RecentToolsContext";
import { useSettings } from "@/components/SettingsContext";
import ToolCard from "@/components/ToolCard";
import { extractShortDescription } from "@/lib/utils";
import tools from "@/data/tools";

export default function RecentPage() {
  const { recentTools, clearRecentTools } = useRecentTools();
  const { settings } = useSettings();

  if (!settings.showUsageStats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">最近使用</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">使用统计功能已关闭</p>
          <p className="text-sm text-muted-foreground mt-2">在设置中开启后，可以看到最近使用的工具记录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">最近使用</h1>
        {recentTools.length > 0 && (
          <button
            onClick={clearRecentTools}
            className="px-4 py-2 text-sm text-red-500 rounded-lg"
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
          {(() => {
            // 构建工具映射表，与热门工具页相同的方法
            const allTools = tools.flatMap(category =>
              category.items.map(item => ({
                href: item.href,
                description: extractShortDescription(item.description)
              }))
            );
            const toolMap = new Map(allTools.map(tool => [tool.href, tool]));
            
            // 格式化日期函数，与最新工具页面相同的格式
            const toCST = (utcDate: string | Date | number): string => {
              const date = new Date(utcDate);
              const cstOffset = 8 * 60;
              const localOffset = date.getTimezoneOffset();
              const cstDate = new Date(date.getTime() + (cstOffset + localOffset) * 60000);
              const year = cstDate.getFullYear();
              const month = String(cstDate.getMonth() + 1).padStart(2, '0');
              const day = String(cstDate.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            };
            
            return recentTools.map((tool, index) => {
              const toolInfo = toolMap.get(tool.href);
              const shortDescription = toolInfo?.description || tool.category;
              const formattedDate = toCST(tool.timestamp);
              
              return (
                <ToolCard
                  key={tool.href}
                  href={tool.href}
                  label={tool.label}
                  description={shortDescription}
                  index={index}
                  showDate={true}
                  date={formattedDate}
                />
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
