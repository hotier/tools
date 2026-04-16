import Link from "next/link";

const tools = [
  { href: "/text-tools/markdown-editor", title: "Markdown 编辑器", description: "在线 Markdown 编辑和预览" },
];

export default function TextToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">文本编辑</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <h2 className="font-semibold mb-1">{tool.title}</h2>
            <p className="text-muted-foreground text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
