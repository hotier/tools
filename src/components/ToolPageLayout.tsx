"use client";

import { ReactNode } from "react";
import { ToolDescription } from "./ToolDescription";

interface ToolPageLayoutProps {
  title: string;
  href: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function ToolPageLayout({ title, href, children, actions }: ToolPageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      <div className="rounded-lg border bg-card/50 p-4">
        {children}
      </div>

      <ToolDescription href={href} />
    </div>
  );
}
