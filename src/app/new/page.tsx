import Link from "next/link";

const newTools = [
  { href: "/dev-tools/json-formatter", title: "JSON 格式化", description: "格式化、压缩、验证 JSON 数据", date: "2024-01-15" },
  { href: "/converters/timestamp", title: "时间戳转换", description: "时间戳与日期时间互相转换", date: "2024-01-14" },
  { href: "/image-tools/qrcode", title: "二维码生成", description: "生成自定义二维码", date: "2024-01-13" },
];

export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">最新工具</h1>
      <p className="text-muted-foreground mb-6">最近添加的工具</p>
      <div className="space-y-4">
        {newTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold mb-1">{tool.title}</h2>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">{tool.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
