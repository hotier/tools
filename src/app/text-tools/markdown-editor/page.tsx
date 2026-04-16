"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";

const defaultMarkdown = `# Markdown 编辑器

这是一个简单的 **Markdown** 编辑器，支持实时预览。

## 功能特性

- 实时预览
- 支持 GFM (GitHub Flavored Markdown)
- 支持表格
- 支持代码高亮

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 表格示例

| 名称 | 价格 | 数量 |
|------|------|------|
| 苹果 | $1   | 10   |
| 香蕉 | $2   | 5    |

## 列表

1. 第一项
2. 第二项
3. 第三项

- 无序列表项 1
- 无序列表项 2

> 这是一段引用文字

[访问 GitHub](https://github.com)
`;

export default function MarkdownEditorPage() {
  useTrackToolUsage("/text-tools/markdown-editor", "Markdown 编辑器");
  const { showToast } = useToast();
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdown);
    showToast("复制成功");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "document.md";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      title="Markdown 编辑器"
      href="/text-tools/markdown-editor"
      actions={
        <>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90"
          >
            复制
          </button>
          <button
            onClick={downloadMarkdown}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            下载
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">编辑</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-[calc(100vh-20rem)] p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder="输入 Markdown 内容"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">预览</label>
          <div className="w-full h-[calc(100vh-20rem)] p-4 border rounded-lg overflow-auto bg-card prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
