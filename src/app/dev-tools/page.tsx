import Link from "next/link";

const tools = [
  { href: "/dev-tools/json-formatter", title: "JSON 格式化", description: "格式化、压缩、验证 JSON 数据" },
  { href: "/dev-tools/base64", title: "Base64 编解码", description: "Base64 编码和解码工具" },
  { href: "/dev-tools/url-encode", title: "URL 编解码", description: "URL 编码和解码工具" },
  { href: "/dev-tools/regex-tester", title: "正则测试", description: "测试和调试正则表达式" },
];

export default function DevToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">开发者工具</h1>
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
