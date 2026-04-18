import tools from "@/data/tools";
import { extractShortDescription } from "@/lib/utils";
import ToolCard from "@/components/ToolCard";

const categoryTools = tools.find((cat) => cat.category === "文本编辑");

export default function TextToolsPage() {
  if (!categoryTools) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">文本编辑</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryTools.items.map((item, index) => (
          <ToolCard
            key={item.href}
            href={item.href}
            label={item.label}
            description={extractShortDescription(item.description)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}