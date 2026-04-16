"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ToolItem {
  href: string;
  label: string;
  description: string;
}

export interface ToolCategory {
  category: string;
  icon: ReactNode;
  items: ToolItem[];
}

interface SidebarContextType {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ selectedCategory, setSelectedCategory, collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
