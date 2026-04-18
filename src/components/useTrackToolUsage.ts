"use client";

import { useEffect, useRef } from "react";
import { useRecentTools } from "./RecentToolsContext";
import { toolCategories } from "./layout/Sidebar";

export function useTrackToolUsage(href: string, label: string) {
  const { addRecentTool } = useRecentTools();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    const category = toolCategories.find((cat) =>
      cat.items.some((item) => item.href === href)
    );

    if (category) {
      addRecentTool({
        href,
        label,
        category: category.category,
      });
    }

    // 更新工具使用次数到数据库
    const updateToolUsage = async () => {
      try {
        await fetch('/api/tool-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ toolPath: href }),
        });
      } catch (error) {
        console.error('Failed to update tool usage:', error);
      }
    };

    updateToolUsage();
  }, [href, label, addRecentTool]);
}
