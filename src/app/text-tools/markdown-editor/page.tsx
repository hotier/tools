"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import MarkdownIt from "markdown-it";
import markdownItGitHubAlerts from "markdown-it-github-alerts";
import markdownItTaskLists from "markdown-it-task-lists";
import hljs from "highlight.js";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const defaultMarkdown = `# Markdown 编辑器

这是一个简单的 **Markdown** 编辑器，支持实时预览。

## 功能特性

- 实时预览
- 支持 GFM (GitHub Flavored Markdown)
- 支持表格
- 支持代码高亮

## 文本格式

**粗体文本** 和 *斜体文本* 以及 ***粗斜体文本***

~~删除线~~ 和 \`行内代码\`

## 标题级别

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
  return { message: "Success" };
}
\`\`\`

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")
    return True
\`\`\`

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

## 表格示例

| 名称 | 价格 | 数量 | 备注 |
|------|------|------|------|
| 苹果 | $1   | 10   | 新鲜 |
| 香蕉 | $2   | 5    | 进口 |
| 橙子 | $1.5 | 8    | 特价 |

## 有序列表

1. 第一项
2. 第二项
   1. 嵌套项 2.1
   2. 嵌套项 2.2
3. 第三项

## 无序列表

- 无序列表项 1
- 无序列表项 2
  - 嵌套项 2.1
  - 嵌套项 2.2
- 无序列表项 3

## 任务列表

- [x] 已完成的任务
- [x] 另一个已完成
- [ ] 未完成的任务
- [ ] 待办事项

## 引用

> 这是一段引用文字
>
> 可以包含多行内容
>
> — 作者名

## 分割线

---

## 链接与图片

[访问 GitHub](https://github.com)

[带标题的链接](https://github.com "GitHub 主页")

## 转义字符

\\* 不是斜体 \\*

\\# 不是标题

## GitHub Alerts

> [!NOTE] 注意
> 这是一条注意信息，用于强调用户应该知道的内容。

> [!TIP] 提示
> 这是一条提示信息，帮助用户更好地完成任务。

> [!IMPORTANT] 重要
> 这是一条重要信息，对成功完成任务很关键。

> [!WARNING] 警告
> 这是一条警告信息，提醒用户注意潜在问题。

> [!CAUTION] 小心
> 这是一条小心信息，提醒用户可能的风险。
`;

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    try {
      const langLabel = lang && hljs.getLanguage(lang) 
        ? `<span class="code-lang">${lang}</span>` 
        : '';
      
      // 安全的HTML转义函数
      const escapeHtml = (text: string): string => {
        if (MarkdownIt.prototype && MarkdownIt.prototype.utils && MarkdownIt.prototype.utils.escapeHtml) {
          return MarkdownIt.prototype.utils.escapeHtml(text);
        }
        // 备用转义方法
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };
      
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs relative">${langLabel}<code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
        } catch {
          // ignore
        }
      }
      return `<pre class="hljs relative">${langLabel}<code>${escapeHtml(str)}</code></pre>`;
    } catch (error) {
      console.error('Highlight error:', error);
      // 备用转义方法
      const escapeHtml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };
      return `<pre class="hljs relative"><code>${escapeHtml(str)}</code></pre>`;
    }
  },
});

md.use(markdownItGitHubAlerts);
md.use(markdownItTaskLists);

export default function MarkdownEditorPage() {
  useTrackToolUsage("/text-tools/markdown-editor", "Markdown 编辑器");
  const { toast } = useToast();
  const { resolvedTheme, mounted } = useTheme();
  const [markdown, setMarkdown] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<"editor" | "preview" | null>(null);

  const [html, setHtml] = useState('');
  const [lastValidHtml, setLastValidHtml] = useState('');

  useEffect(() => {
    try {
      const renderedHtml = md.render(markdown);
      setHtml(renderedHtml);
      setLastValidHtml(renderedHtml);
    } catch (error) {
      console.error('Markdown render error:', error);
      // 渲染失败时显示上一次成功渲染的结果
      setHtml(lastValidHtml || '<div class="text-gray-400 italic">请输入Markdown内容</div>');
    }
  }, [markdown, lastValidHtml]);

  const handleEditorScroll = () => {
    if (isScrolling.current === "preview") return;
    isScrolling.current = "editor";

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    const scrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);

    setTimeout(() => {
      isScrolling.current = null;
    }, 50);
  };

  const handlePreviewScroll = () => {
    if (isScrolling.current === "editor") return;
    isScrolling.current = "preview";

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    const scrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    editor.scrollTop = scrollRatio * (editor.scrollHeight - editor.clientHeight);

    setTimeout(() => {
      isScrolling.current = null;
    }, 50);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdown);
    toast.success("复制成功");
  };

  const loadSampleData = () => {
    setMarkdown(defaultMarkdown);
  };

  const downloadMarkdown = () => {
    if (!markdown.trim()) {
      toast.error("不能下载空文件");
      return;
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `markdown_${timestamp}.md`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout title="Markdown 编辑器" href="/text-tools/markdown-editor">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">编辑</label>
          <textarea
            ref={editorRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onScroll={handleEditorScroll}
            className="w-full h-[calc(100vh-20rem)] p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder="输入 Markdown 内容"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">预览</label>
          <div
            ref={previewRef}
            onScroll={handlePreviewScroll}
            className={`w-full h-[calc(100vh-20rem)] p-4 border rounded-lg overflow-auto bg-card prose max-w-none scrollbar-hide ${mounted && resolvedTheme === "dark" ? "prose-invert" : ""}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => {
            if (markdown) {
              copyToClipboard();
            } else {
              loadSampleData();
            }
          }}
          variant={markdown ? "success" : "secondary"}
        >
          {markdown ? "复制内容" : "示例数据"}
        </Button>
        <Button onClick={downloadMarkdown} variant="info" disabled={!markdown}>
          下载
        </Button>
        <Button onClick={() => setMarkdown("")} variant="destructive" disabled={!markdown}>
          清空
        </Button>
      </div>
    </ToolPageLayout>
  );
}
