"use client";

import { useEffect, useRef } from "react";
import { useRecentTools } from "./RecentToolsContext";
import { toolCategories } from "./layout/Sidebar";

const MIN_STAY_DURATION = 5000;

export function useTrackToolUsage(href: string, label: string) {
  const { addRecentTool } = useRecentTools();
  const trackedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trackedRef.current) return;

    startTimeRef.current = Date.now();

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

    timerRef.current = setTimeout(() => {
      if (!trackedRef.current) {
        trackedRef.current = true;

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
      }
    }, MIN_STAY_DURATION);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [href, label, addRecentTool]);
}
