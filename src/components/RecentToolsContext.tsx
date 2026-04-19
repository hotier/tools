"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

interface RecentTool {
  href: string;
  label: string;
  category: string;
  timestamp: number;
}

interface RecentToolsContextType {
  recentTools: RecentTool[];
  addRecentTool: (tool: Omit<RecentTool, "timestamp">) => void;
  clearRecentTools: () => void;
}

const RecentToolsContext = createContext<RecentToolsContextType | undefined>(undefined);

const STORAGE_KEY = "recent-tools";
const MAX_RECENT = 10;

export function RecentToolsProvider({ children }: { children: ReactNode }) {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentTools(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent tools", e);
      }
    }
  }, []);

  useEffect(() => {
    if (recentTools.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentTools));
    }
  }, [recentTools]);

  const addRecentTool = useCallback((tool: Omit<RecentTool, "timestamp">) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((t) => t.href !== tool.href);
      const newTool: RecentTool = { ...tool, timestamp: Date.now() };
      return [newTool, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecentTools = useCallback(() => {
    setRecentTools([]);
  }, []);

  useEffect(() => {
    const handleClearRecentTools = () => {
      setRecentTools([]);
    };

    window.addEventListener("clear-recent-tools", handleClearRecentTools);
    return () => {
      window.removeEventListener("clear-recent-tools", handleClearRecentTools);
    };
  }, []);

  return (
    <RecentToolsContext.Provider value={{ recentTools, addRecentTool, clearRecentTools }}>
      {children}
    </RecentToolsContext.Provider>
  );
}

export function useRecentTools() {
  const context = useContext(RecentToolsContext);
  if (context === undefined) {
    throw new Error("useRecentTools must be used within a RecentToolsProvider");
  }
  return context;
}
