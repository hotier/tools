import fs from "fs";
import path from "path";
import { APP_VERSION } from "@/config/version";

export const dynamic = "force-static";

interface ChangeSection {
  title: string;
  items: string[];
}

interface VersionEntry {
  version: string;
  date?: string;
  isLatest: boolean;
  changeType?: string;
  sections: ChangeSection[];
}

async function getChangelog() {
  try {
    const filePath = path.join(process.cwd(), "CHANGELOG.md");
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function cleanText(text: string): string {
  return text
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[\w-]+\s+[a-f0-9]+\s*(-\s*)?/i, "")
    .replace(/Thanks?\s+@[\w-]+!?\s*/gi, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/feat:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseVersionBlock(block: string, index: number): VersionEntry | null {
  const versionMatch = block.match(/^##\s+\[?([\d.]+)\]?/m);
  if (!versionMatch) return null;
  const version = versionMatch[1];

  const dateMatch = block.match(/\d{4}-\d{2}-\d{2}/);
  const date = dateMatch ? dateMatch[0] : undefined;

  // 提取变更类型（Patch/Minor/Major）
  let changeType = "";
  const changeTypeMatch = block.match(/^###\s+(Patch|Minor|Major)\s+Changes/m);
  if (changeTypeMatch) {
    changeType = changeTypeMatch[1];
  }

  const lines = block.split("\n");
  const sections: ChangeSection[] = [];
  let currentTitle = "";
  let currentItems: string[] = [];

  // 解析 sections，跳过版本号和无关内容
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 跳过版本号行
    if (trimmed.match(/^##\s+\[?[\d.]+\]?/)) {
      continue;
    }

    // 跳过 Changesets 格式的行（如 ### Patch Changes 等）
    if (trimmed.match(/^###\s+(Patch|Minor|Major)\s+Changes/)) {
      continue;
    }

    // 处理包含提交哈希和感谢信息的行，提取变更内容
    if (trimmed.match(/^-\s+\[.+\].*Thanks/)) {
      // 提取变更内容（去掉提交哈希和感谢信息）
      // 匹配格式: - [`a1aea95`](https://github.com/hotier/tools/commit/a1aea957374dc3385eb9adf5c14a29de41ddb587) Thanks [@hotier](https://github.com/hotier)! - 优化了用户体验
      // 直接提取最后一个 "- " 后的内容
      const parts = trimmed.split(" - ");
      if (parts.length > 1) {
        const item = cleanText(parts[parts.length - 1]);
        if (item) {
          if (!currentTitle) {
            currentTitle = "其他";
          }
          currentItems.push(item);
        }
      }
      continue;
    }

    // 处理 section 标题
    if (trimmed.startsWith("### ")) {
      if (currentTitle && currentItems.length > 0) {
        sections.push({ title: currentTitle, items: [...currentItems] });
      }
      let title = trimmed.replace(/^###\s+/, "").replace(/\*\*/g, "");
      if (title === "新增" || title === "优化" || title === "修复" || title === "删除" || title === "其他") {
        currentTitle = title;
      } else if (title.includes("新增") || title.includes("added") || title.includes("feature")) {
        currentTitle = "新增";
      } else if (title.includes("优化") || title.includes("改进") || title.includes("changed")) {
        currentTitle = "优化";
      } else if (title.includes("修复") || title.includes("fixed")) {
        currentTitle = "修复";
      } else if (title.includes("删除") || title.includes("removed")) {
        currentTitle = "删除";
      } else {
        currentTitle = "其他";
      }
      currentItems = [];
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      if (currentTitle && currentItems.length > 0) {
        sections.push({ title: currentTitle, items: [...currentItems] });
      }
      const title = trimmed.replace(/\*\*/g, "");
      if (title === "新功能") {
        currentTitle = "新增";
      } else if (title === "优化") {
        currentTitle = "优化";
      } else if (title === "修改") {
        currentTitle = "优化";
      } else if (title === "删除") {
        currentTitle = "删除";
      } else {
        currentTitle = "其他";
      }
      currentItems = [];
    } else if (trimmed.startsWith("- ")) {
      // 处理普通的变更行
      const item = cleanText(trimmed.slice(2));
      if (item) {
        if (!currentTitle) {
          currentTitle = "其他";
        }
        currentItems.push(item);
      }
    } else if (trimmed.startsWith("  - ") || trimmed.startsWith("\t- ")) {
      // 处理缩进的变更行
      const item = cleanText(trimmed.replace(/^[\s]+-\s/, ""));
      if (item && currentItems.length > 0) {
        currentItems[currentItems.length - 1] += " " + item;
      }
    }
  }

  if (currentTitle && currentItems.length > 0) {
    sections.push({ title: currentTitle, items: currentItems });
  }

  // 只有当没有任何 sections 时，才添加其他部分
  if (sections.length === 0) {
    const content = cleanText(block);
    if (content) {
      sections.push({ title: "其他", items: [content] });
    }
  }

  if (sections.length === 0) return null;

  return { version, date, isLatest: index === 0, changeType, sections };
}

function VersionCard({ entry }: { entry: VersionEntry }) {
  // 确保最新版本始终展开
  const isOpen = entry.isLatest;
  
  return (
    <section className="border rounded-xl bg-card overflow-hidden">
      <details open={isOpen}>
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">v{entry.version}</h2>
            {entry.changeType && (
              <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                {entry.changeType}
              </span>
            )}
            {entry.isLatest && (
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                最新
              </span>
            )}
          </div>
          {entry.date && (
            <span className="text-sm text-muted-foreground">{entry.date}</span>
          )}
        </summary>
        <div className="border-t p-6 space-y-4">
          {entry.sections.map((section, index) => (
            <div key={`${section.title}-${index}`}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{section.title}</h3>
              <ul className="space-y-1 pl-5 list-disc">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm text-foreground/80 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

export default async function ChangelogPage() {
  const changelog = await getChangelog();
  // 修复版本块分割，确保正确分割版本
  const blocks = changelog.split(/(?=^##\s+(?:\[?[\d.]+\]?|Unreleased))/m).filter(Boolean);
  const versions = blocks.map((b, i) => parseVersionBlock(b, i)).filter((v): v is VersionEntry => v !== null).slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">更新日志</h1>
        <p className="text-sm text-muted-foreground">当前版本 v{APP_VERSION}</p>
      </div>

      <div className="space-y-4">
        {versions.map((entry) => (
          <VersionCard key={entry.version} entry={entry} />
        ))}
      </div>

      <div className="mt-12 text-center text-xs text-muted-foreground">
        <p>所有重要的变更都将记录在此文件中</p>
      </div>
    </div>
  );
}