"use client";

import { useMemo } from "react";
import MarkdownIt from "markdown-it";
import markdownItGitHubAlerts from "markdown-it-github-alerts";
import markdownItTaskLists from "markdown-it-task-lists";
import hljs from "highlight.js";
import tools from "@/data/tools";

interface ToolDescriptionProps {
  href: string;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    const langLabel = lang && hljs.getLanguage(lang)
      ? `<span class="code-lang">${lang}</span>`
      : '';

    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs relative">${langLabel}<code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch {
        // ignore
      }
    }
    return `<pre class="hljs relative">${langLabel}<code>${MarkdownIt.prototype.utils.escapeHtml(str)}</code></pre>`;
  },
});

md.use(markdownItGitHubAlerts);
md.use(markdownItTaskLists);

export function ToolDescription({ href }: ToolDescriptionProps) {
  const tool = tools
    .flatMap((cat) => cat.items)
    .find((item) => item.href === href);

  const html = useMemo(() => {
    return md.render(tool?.description || "");
  }, [tool?.description]);

  if (!tool) return null;

  return (
    <div className="mt-8 p-4 rounded-lg border bg-card/50">
      <style>{`
        .tool-desc-content {
          font-size: 0.9375rem;
        }
        .tool-desc-content h1,
        .tool-desc-content h2,
        .tool-desc-content h3,
        .tool-desc-content h4,
        .tool-desc-content h5,
        .tool-desc-content h6 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          padding-left: 0.75rem;
          border-left: 3px solid #3b82f6;
          color: var(--foreground);
        }
        .tool-desc-content h1:first-child,
        .tool-desc-content h2:first-child,
        .tool-desc-content h3:first-child {
          margin-top: 0;
        }
        .tool-desc-content p {
          margin-bottom: 0.75rem;
        }
        .tool-desc-content ul,
        .tool-desc-content ol {
          margin-bottom: 0.75rem;
          padding-left: 1.25rem;
          list-style-position: outside;
        }
        .tool-desc-content ul {
          list-style-type: disc;
        }
        .tool-desc-content ol {
          list-style-type: decimal;
        }
        .tool-desc-content li {
          margin-bottom: 0.375rem;
        }
        .tool-desc-content li > ul,
        .tool-desc-content li > ol {
          margin-top: 0.375rem;
          margin-bottom: 0.375rem;
        }
        .tool-desc-content pre {
          margin-bottom: 0.75rem;
        }
        .tool-desc-content code {
          background-color: var(--muted);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .tool-desc-content pre code {
          background-color: transparent;
          padding: 0;
        }
      `}</style>
      <div
        className="tool-desc-content text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}