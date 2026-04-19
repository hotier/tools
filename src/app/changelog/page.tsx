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
    .replace(/Thanks?\s+@[\w-]+!?\s*/gi, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseVersionBlock(block: string, index: number): VersionEntry | null {
  const versionMatch = block.match(/^##\s+\[([\d.]+)\]/m);
  if (!versionMatch) return null;
  const version = versionMatch[1];

  const dateMatch = block.match(/\d{4}-\d{2}-\d{2}/);
  const date = dateMatch ? dateMatch[0] : undefined;

  // 提取变更类型（Patch/Minor/Major）
  let changeType = "";
  const versionParts = version.split(".").map(Number);
  if (versionParts.length >= 3) {
    if (versionParts[0] > 0) {
      changeType = "Major";
    } else if (versionParts[1] > 0) {
      changeType = "Minor";
    } else {
      changeType = "Patch";
    }
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
    if (trimmed.match(/^##\s+\[[\d.]+\]/)) {
      continue;
    }

    // 处理 section 标题（支持 emoji 格式）
    if (trimmed.startsWith("### ")) {
      if (currentTitle && currentItems.length > 0) {
        sections.push({ title: currentTitle, items: [...currentItems] });
      }
      let title = trimmed.replace(/^###\s+/, "").replace(/\*\*/g, "");
      // 保留原始带 emoji 的标题
      currentTitle = title;
      currentItems = [];
    } else if (trimmed.startsWith("* ")) {
      // 处理普通的变更行
      let item = cleanText(trimmed.slice(2));
      // 移除提交哈希链接
      item = item.replace(/\([^)]+\)/g, "").trim();
      if (item) {
        if (!currentTitle) {
          currentTitle = "其他";
        }
        currentItems.push(item);
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
  // 修复版本块分割，确保正确分割版本（只分割 ## 开头的版本号）
  const blocks = changelog.split(/(?=^##\s+\[)/m).filter(Boolean);
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