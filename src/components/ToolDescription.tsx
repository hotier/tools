"use client";

import { toolCategories } from "./layout/Sidebar";

interface ToolDescriptionProps {
  href: string;
}

export function ToolDescription({ href }: ToolDescriptionProps) {
  const tool = toolCategories
    .flatMap((cat) => cat.items)
    .find((item) => item.href === href);

  if (!tool) return null;

  return (
    <div className="mt-8 p-4 rounded-lg border bg-card/50">
      <h3 className="font-semibold mb-2">工具简介</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {tool.description}
      </p>
    </div>
  );
}
