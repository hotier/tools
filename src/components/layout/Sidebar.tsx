"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSidebar, ToolCategory, ToolItem } from "../SidebarContext";

const tools: ToolCategory[] = [
  {
    category: "开发者工具",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    items: [
      { href: "/dev-tools/json-formatter", label: "JSON 格式化", description: "在线JSON格式化、美化、压缩、校验工具，支持自定义缩进" },
      { href: "/dev-tools/base64", label: "Base64 编解码", description: "Base64编码与解码工具，支持中文和特殊字符" },
      { href: "/dev-tools/url-encode", label: "URL 编解码", description: "URL编码与解码工具，处理特殊字符和中文参数" },
      { href: "/dev-tools/regex-tester", label: "正则测试", description: "正则表达式在线测试工具，实时匹配高亮显示" },
    ],
  },
  {
    category: "常用转换",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    items: [
      { href: "/converters/timestamp", label: "时间戳转换", description: "时间戳与日期时间格式互相转换，支持毫秒和秒级时间戳。\n时间戳说明：秒级时间戳为10位数字，毫秒时间戳为13位数字，Unix时间戳从1970-01-01 00:00:00 UTC开始。常用编程语言获取时间戳：JavaScript: Date.now() / 1000；Python: time.time()；PHP: time()；Java: System.currentTimeMillis() / 1000" },
      { href: "/converters/interval-parser", label: "区间解析", description: "识别数学区间表达式的上下限，支持自定义开区间边界精度" },
      { href: "/converters/unit-converter", label: "单位换算", description: "长度、重量、温度等单位换算工具，支持多种常用单位" },
      { href: "/converters/color-picker", label: "颜色选择器", description: "颜色选择与格式转换工具，支持HEX、RGB、HSL格式互转" },
    ],
  },
  {
    category: "图像处理",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    items: [
      { href: "/image-tools/qrcode", label: "二维码生成", description: "在线二维码生成工具，支持自定义尺寸和容错级别" },
    ],
  },
  {
    category: "文本编辑",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    items: [
      { href: "/text-tools/markdown-editor", label: "Markdown 编辑器", description: "在线Markdown编辑器，支持实时预览和GFM语法" },
    ],
  },
];

export { tools as toolCategories };

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCategory, setSelectedCategory, collapsed, setCollapsed } = useSidebar();
  const sidebarRef = useRef<HTMLElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState("auto");

  useEffect(() => {
    if (!collapsed && sidebarRef.current) {
      const navItems = sidebarRef.current.querySelectorAll(".nav-item-text");
      let maxWidth = 0;
      navItems.forEach((item) => {
        const textWidth = (item as HTMLElement).scrollWidth;
        if (textWidth > maxWidth) maxWidth = textWidth;
      });
      const iconWidth = 20;
      const paddingX = 24;
      const gap = 12;
      const calculatedWidth = maxWidth + iconWidth + paddingX + gap;
      setSidebarWidth(`${Math.max(160, calculatedWidth)}px`);
    }
  }, [collapsed]);

  const isCategoryActive = (items: ToolItem[]) => {
    return items.some((item) => pathname === item.href);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`hidden lg:flex flex-col border-r bg-card transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] ${
        collapsed ? "w-16" : ""
      }`}
      style={{ width: collapsed ? "4rem" : sidebarWidth }}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {tools.map((group) => {
            const isActive = isCategoryActive(group.items);
            const isSelected = selectedCategory === group.category;

            return (
              <button
                key={group.category}
                onClick={() => handleCategoryClick(group.category)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive || isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? group.category : undefined}
              >
                <span className="flex-shrink-0">{group.icon}</span>
                {!collapsed && (
                  <span className="nav-item-text flex-1 text-left text-sm font-medium whitespace-nowrap">
                    {group.category}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-2 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "设置" : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {!collapsed && <span className="text-sm">设置</span>}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "展开" : "收起"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 transition-transform flex-shrink-0 ${collapsed ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
            {!collapsed && <span className="text-sm">收起侧栏</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
