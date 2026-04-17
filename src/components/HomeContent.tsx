"use client";

import Link from "next/link";
import { useSidebar, extractShortDescription } from "./SidebarContext";
import { toolCategories } from "./layout/Sidebar";

const categoryRoutes: Record<string, string> = {
  "开发者工具": "/dev-tools",
  "常用转换": "/converters",
  "图像处理": "/image-tools",
  "文本编辑": "/text-tools",
};

export function HomeContent() {
  const { selectedCategory } = useSidebar();

  const category = selectedCategory
    ? toolCategories.find((t) => t.category === selectedCategory)
    : null;

  if (category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-primary">{category.icon}</span>
          <h1 className="text-3xl font-bold">{category.category}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.items.map((item) => (
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">我的工具箱</h1>
        <p className="text-muted-foreground text-lg">
          收集了各种实用的在线工具，让工作更高效
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {toolCategories.map((cat) => (
          <Link
            key={cat.category}
            href={categoryRoutes[cat.category] || "/"}
            className="group p-6 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="text-primary">{cat.icon}</div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {cat.category}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-1">
                  {cat.items.map((i) => i.label).join("、")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}