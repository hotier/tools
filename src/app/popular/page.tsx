import Link from "next/link";

const popularTools = [
  { href: "/dev-tools/json-formatter", title: "JSON 格式化", description: "格式化、压缩、验证 JSON 数据", usage: 1250 },
  { href: "/converters/timestamp", title: "时间戳转换", description: "时间戳与日期时间互相转换", usage: 980 },
  { href: "/dev-tools/base64", title: "Base64 编解码", description: "Base64 编码和解码工具", usage: 856 },
  { href: "/image-tools/qrcode", title: "二维码生成", description: "生成自定义二维码", usage: 720 },
  { href: "/converters/color-picker", title: "颜色选择器", description: "颜色格式转换和选择", usage: 650 },
];

export default function PopularPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">热门工具</h1>
      <p className="text-muted-foreground mb-6">使用次数最多的工具</p>
      <div className="space-y-4">
        {popularTools.map((tool, index) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {index + 1}
              </span>
              <div className="flex-1">
                <h2 className="font-semibold mb-1">{tool.title}</h2>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
              </div>
              <span className="text-sm text-muted-foreground">{tool.usage} 次使用</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
