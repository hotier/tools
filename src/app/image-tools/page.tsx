import Link from "next/link";

const tools = [
  { href: "/image-tools/qrcode", title: "二维码生成", description: "生成自定义二维码" },
];

export default function ImageToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">图像处理</h1>
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
