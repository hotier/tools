"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ToolItem {
  href: string;
  label: string;
  description: string;
  date?: string;
}

export interface ToolCategory {
  category: string;
  icon: ReactNode;
  items: ToolItem[];
}

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
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

export { extractShortDescription } from "@/lib/utils";
