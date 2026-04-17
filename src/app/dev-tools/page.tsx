import Link from "next/link";
import tools from "@/data/tools";
import { extractShortDescription } from "@/lib/utils";

const categoryTools = tools.find((cat) => cat.category === "开发者工具");

export default function DevToolsPage() {
  if (!categoryTools) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">开发者工具</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryTools.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <h2 className="font-semibold mb-1">{item.label}</h2>
            <p className="text-muted-foreground text-sm line-clamp-1">{extractShortDescription(item.description)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}