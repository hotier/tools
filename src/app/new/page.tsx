import tools from "@/data/tools";
import { extractShortDescription } from "@/lib/utils";
import { getDb } from "@/lib/db";
import ToolCard from "@/components/ToolCard";

type ToolInfo = {
  href: string;
  title: string;
  description: string;
  date: string;
};

function toCST(utcDate: string | Date): string {
  const date = new Date(utcDate);
  const cstOffset = 8 * 60;
  const localOffset = date.getTimezoneOffset();
  const cstDate = new Date(date.getTime() + (cstOffset + localOffset) * 60000);
  const year = cstDate.getFullYear();
  const month = String(cstDate.getMonth() + 1).padStart(2, '0');
  const day = String(cstDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getNewTools(): Promise<ToolInfo[]> {
  try {
    const db = getDb();
    const usageData = await db`
      SELECT tool_path, usage_count, created_at
      FROM tool_usage
      ORDER BY created_at DESC
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

    const newTools = usageData
      .map((item) => {
        const tool = toolMap.get(item.tool_path as string);
        if (tool) {
          return {
            ...tool,
            date: toCST(item.created_at as Date)
          };
        }
        return null;
      })
      .filter((tool): tool is ToolInfo => tool !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return newTools;
  } catch (error) {
    console.error('Error fetching new tools from database:', error);
    const allTools = tools.flatMap(category =>
      category.items.map(item => ({
        href: item.href,
        title: item.label,
        description: extractShortDescription(item.description),
        date: toCST(new Date())
      }))
    );
    return allTools.slice(0, 5);
  }
}

async function NewToolsList() {
  const newTools = await getNewTools();

  if (newTools.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无数据</div>;
  }

  return (
    <div className="space-y-4">
      {newTools.map((tool: ToolInfo, index: number) => (
        <ToolCard
          key={tool.href}
          href={tool.href}
          label={tool.title}
          description={tool.description}
          index={index}
          layout="list"
          showDate={true}
          date={tool.date}
        />
      ))}
    </div>
  );
}

export const revalidate = 3600;

export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">最新工具</h1>
      <p className="text-muted-foreground mb-6">最近添加的工具</p>
      <NewToolsList />
    </div>
  );
}