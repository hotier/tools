"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { useSearch } from "../SearchContext";
import { useRecentTools } from "../RecentToolsContext";
import { useSidebar } from "../SidebarContext";
import { toolCategories } from "./Sidebar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } = useSearch();
  const { recentTools } = useRecentTools();
  const { setSelectedCategory } = useSidebar();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTools = toolCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      category: cat.category,
    }))
  );

  const filteredTools = searchQuery
    ? allTools.filter(
        (tool) =>
          tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsSearchOpen]);

  const handleToolClick = (href: string) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex-shrink-0">
          <Link
            href="/"
            onClick={() => setSelectedCategory(null)}
            className="flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
            <span className="font-bold text-lg">我的工具箱</span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center px-8">
          <div ref={searchRef} className="relative w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索工具... (按 / 快捷键)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            {isSearchOpen && searchQuery && filteredTools.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.href}
                    onClick={() => handleToolClick(tool.href)}
                    className="w-full px-4 py-2 text-left hover-highlight transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm">{tool.label}</span>
                    <span className="text-xs text-muted-foreground">{tool.category}</span>
                  </button>
                ))}
              </div>
            )}

            {isSearchOpen && searchQuery && filteredTools.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg p-4 z-50">
                <p className="text-sm text-muted-foreground text-center">未找到匹配的工具</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center space-x-1">
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              onClick={() => setSelectedCategory(null)}
              className="px-3 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium"
            >
              首页
            </Link>
            <Link
              href="/new"
              className="px-3 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium"
            >
              最新
            </Link>
            <Link
              href="/popular"
              className="px-3 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium"
            >
              热门
            </Link>
            <Link
              href="/recent"
              className="px-3 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium"
            >
              最近使用
            </Link>
          </nav>
          <ThemeToggle />
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="px-4 py-3">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                onClick={() => {
                  setSelectedCategory(null);
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium"
              >
                首页
              </Link>
              <Link href="/new" className="px-4 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                最新
              </Link>
              <Link href="/popular" className="px-4 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                热门
              </Link>
              <Link href="/recent" className="px-4 py-2 text-muted-foreground hover:text-foreground hover-highlight rounded-lg transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                最近使用
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
