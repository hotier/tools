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
  }, [href, label, addRecentTool]);
}
