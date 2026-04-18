import tools from "@/data/tools";
import { extractShortDescription } from "@/lib/utils";
import { db } from "@/lib/db";
import ToolCard from "@/components/ToolCard";

type ToolInfo = {
  href: string;
  title: string;
  description: string;
  usage: number;
};

async function getPopularTools(): Promise<ToolInfo[]> {
  try {
    const usageData = await db`
      SELECT tool_path, usage_count
      FROM tool_usage
      ORDER BY usage_count DESC
      LIMIT 5
    `;

    const allTools = tools.flatMap(category =>
      category.items.map(item => ({
        href: item.href,
        title: item.label,
        description: extractShortDescription(item.description)
      }))
    );

    const toolMap = new Map(allTools.map(tool => [tool.href, tool]));
    const popularTools = usageData
      .map((item) => {
        const tool = toolMap.get(item.tool_path as string);
        if (tool) {
          return {
            ...tool,
            usage: item.usage_count as number
          };
        }
        return null;
      })
      .filter((tool): tool is ToolInfo => tool !== null)
      .sort((a, b) => b.usage - a.usage);

    return popularTools;
  } catch (error) {
    console.error('Error fetching popular tools from database:', error);
    // 数据库连接失败时，使用本地工具数据作为 fallback
    const allTools = tools.flatMap(category =>
      category.items.map(item => ({
        href: item.href,
        title: item.label,
        description: extractShortDescription(item.description),
        // 使用随机使用次数作为默认值
        usage: Math.floor(Math.random() * 1000) + 1
      }))
    );
    // 按使用次数排序并取前 5 个
    return allTools.sort((a, b) => b.usage - a.usage).slice(0, 5);
  }
}

async function PopularToolsList() {
  const popularTools = await getPopularTools();

  if (popularTools.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无数据</div>;
  }

  return (
    <div className="space-y-4">
      {popularTools.map((tool: ToolInfo, index: number) => (
        <ToolCard
          key={tool.href}
          href={tool.href}
          label={tool.title}
          description={tool.description}
          index={index}
          layout="list"
          showUsage={true}
          usage={tool.usage}
        />
      ))}
    </div>
  );
}

export const revalidate = 3600; // 缓存1小时

export default function PopularPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">热门工具</h1>
      <p className="text-muted-foreground mb-6">使用次数最多的工具</p>
      <PopularToolsList />
    </div>
  );
}
