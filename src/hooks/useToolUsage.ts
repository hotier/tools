'use client';

import { useEffect } from 'react';

/**
 * 跟踪工具使用次数的 hook
 * @param toolPath 工具的路径
 */
export function useToolUsage(toolPath: string) {
  useEffect(() => {
    // 发送请求更新工具使用次数
    const updateUsage = async () => {
      try {
        await fetch('/api/tool-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ toolPath }),
        });
      } catch (error) {
        console.error('Failed to update tool usage:', error);
      }
    };

    updateUsage();
  }, [toolPath]);
}
