// 全局工具方法
export function registerConsoleUtils() {
  // 在控制台中注册获取最新工具使用次数的方法
  (window as any).getToolUsage = async (type: 'popular' | 'new' = 'popular') => {
    try {
      const response = await fetch(`/api/tool-usage?type=${type}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取工具使用次数失败:', error);
      return null;
    }
  };

  // 注册强制重新验证缓存的方法
  (window as any).revalidateCache = async (path: string = '/popular') => {
    try {
      const response = await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // 重新加载页面以显示最新数据
      window.location.reload();
      return data;
    } catch (error) {
      console.error('缓存重新验证失败:', error);
      return null;
    }
  };

  // 控制台工具方法已注册
  // 使用方法:
  // 1. getToolUsage(type): 获取最新工具使用次数
  //    - type: "popular" (热门工具，默认) 或 "new" (最新添加)
  //    示例: getToolUsage() 或 getToolUsage("new")
  // 2. revalidateCache(path): 强制重新验证缓存并刷新页面
  //    - path: 要重新验证的路径，默认为 "/popular"
  //    示例: revalidateCache() 或 revalidateCache("/popular")
}
