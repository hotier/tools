"use client";

import Link from "next/link";
import { useSidebar } from "./SidebarContext";
import { toolCategories } from "./layout/Sidebar";

export function CategoryToolsList() {
  const { selectedCategory } = useSidebar();

  if (!selectedCategory) {
    return null;
  }

  const category = toolCategories.find((t) => t.category === selectedCategory);

  if (!category) {
    return null;
  }

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
            <p className="text-muted-foreground text-sm">点击使用此工具</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
