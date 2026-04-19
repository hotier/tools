import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { useSearch } from "../SearchContext";
import { useRecentTools } from "../RecentToolsContext";
import { toolCategories } from "./Sidebar";
import { extractShortDescription } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } = useSearch();
  const { recentTools } = useRecentTools();
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
    ? allTools
        .map((tool) => {
          const shortDesc = extractShortDescription(tool.description);
          const labelMatch = tool.label.toLowerCase().includes(searchQuery.toLowerCase());
          const categoryMatch = tool.category.toLowerCase().includes(searchQuery.toLowerCase());
          const descMatch = shortDesc.toLowerCase().includes(searchQuery.toLowerCase());

          let descSnippet = "";
          if (descMatch) {
            const lowerDesc = shortDesc.toLowerCase();
            const lowerQuery = searchQuery.toLowerCase();
            const index = lowerDesc.indexOf(lowerQuery);
            const start = Math.max(0, index - 15);
            const end = Math.min(shortDesc.length, index + searchQuery.length + 25);
            descSnippet = (start > 0 ? "..." : "") + shortDesc.slice(start, end) + (end < shortDesc.length ? "..." : "");
          }

          return {
            ...tool,
            shortDesc,
            labelMatch,
            categoryMatch,
            descMatch,
            descSnippet,
            priority: labelMatch ? 0 : categoryMatch ? 1 : 2,
          };
        })
        .filter((tool) => tool.labelMatch || tool.categoryMatch || tool.descMatch)
        .sort((a, b) => a.priority - b.priority)
    : [];

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  };

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
              className="flex items-center group"
            >
            <img
              src="/favicon.ico"
              alt="简序"
              className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
            />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center hidden lg:block">
          <div ref={searchRef} className="relative w-full max-w-md mx-auto px-4">
            {/* 1. 输入框（底层，带背景） */}
            <input
              ref={inputRef}
              type="text"
              placeholder=""
              value={searchQuery ?? ""}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-12 pr-4 py-2 text-sm text-foreground border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary relative z-0"
            />
            
            {/* 2. 自定义占位层（上层，不影响输入） */}
            {searchQuery === "" && (
              <div className="absolute inset-0 flex items-center pl-16 pointer-events-none z-10 select-none">
                <span className="text-muted-foreground text-sm">请键入</span>
                <svg 
                  className="mx-1.5 text-muted-foreground"
                  width="14" 
                  height="14" 
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  <path d="M11.354 4.646a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708l6-6a.5.5 0 0 1 .708 0"/>
                </svg>
                <span className="text-muted-foreground text-sm">搜索</span>
              </div>
            )}
            
            {/* 3. 放大镜图标（上层，不被遮挡） */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            {isSearchOpen && searchQuery && filteredTools.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-card border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.href}
                    onClick={() => handleToolClick(tool.href)}
                    className="w-full px-4 py-2 text-left hover-highlight transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{highlightText(tool.label, searchQuery)}</div>
                      {tool.descSnippet && (
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">
                          {highlightText(tool.descSnippet, searchQuery)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {tool.category}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {isSearchOpen && searchQuery && filteredTools.length === 0 && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-card border rounded-lg shadow-lg p-4 z-50">
                <p className="text-sm text-muted-foreground text-center">未找到匹配的工具</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center space-x-1 ml-auto">
          <nav className="hidden lg:flex items-center space-y-1">
            <Link
              href="/"
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
                placeholder=""
                value={searchQuery ?? ""}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-12 pr-4 py-2 text-sm text-foreground border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary relative z-0"
              />
              
              {/* 移动端自定义占位层（同样调整层级） */}
              {searchQuery === "" && (
                <div className="absolute inset-0 flex items-center pl-12 pointer-events-none z-10 select-none">
                  <span className="text-muted-foreground text-sm">请键入</span>
                  <svg 
                    className="mx-1.5 text-muted-foreground"
                    width="14" 
                    height="14" 
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M11.354 4.646a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708l6-6a.5.5 0 0 1 .708 0"/>
                  </svg>
                  <span className="text-muted-foreground text-sm">搜索</span>
                </div>
              )}
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>

              {isSearchOpen && searchQuery && filteredTools.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.href}
                      onClick={() => handleToolClick(tool.href)}
                      className="w-full px-4 py-2 text-left hover-highlight transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{highlightText(tool.label, searchQuery)}</div>
                        {tool.descSnippet && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">
                            {highlightText(tool.descSnippet, searchQuery)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {tool.category}
                      </span>
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
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                onClick={() => {
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