import tools from "./tools";

// 从工具数据自动生成分类路由映射
export const categoryRoutes: Record<string, string> = tools.reduce((routes, category) => {
  // 从第一个工具的 href 中提取分类路由
  if (category.items.length > 0) {
    const firstToolHref = category.items[0].href;
    // 提取第一个斜杠后的部分作为分类路由
    const categoryRoute = firstToolHref.split('/').slice(0, 2).join('/');
    routes[category.category] = categoryRoute;
  }
  return routes;
}, {} as Record<string, string>);

// 从工具数据自动生成工具路由映射
export const toolRoutes: Record<string, string> = tools.flatMap(category => 
  category.items.map(item => [item.label, item.href] as [string, string])
).reduce((routes, [label, href]) => {
  routes[label] = href;
  return routes;
}, {} as Record<string, string>);
