import Link from "next/link";

const tools = [
  { href: "/converters/timestamp", title: "时间戳转换", description: "时间戳与日期时间互相转换" },
  { href: "/converters/interval-parser", title: "区间解析", description: "识别数学区间表达式的上下限" },
  { href: "/converters/unit-converter", title: "单位换算", description: "长度、重量、温度等单位换算" },
  { href: "/converters/color-picker", title: "颜色选择器", description: "颜色格式转换和选择" },
];

export default function ConvertersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">常用转换</h1>
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
