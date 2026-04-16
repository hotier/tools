"use client";

import { useState, useMemo } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function RegexTesterPage() {
  useTrackToolUsage("/dev-tools/regex-tester", "正则测试");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState("");

  const results = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);
      setError("");
      return matches;
    } catch (e) {
      setError(e instanceof Error ? e.message : "正则表达式错误");
      return null;
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (!pattern || !testString || error) return testString;
    try {
      const regex = new RegExp(`(${pattern})`, flags.includes("g") ? flags : flags + "g");
      return testString.replace(regex, (match) => {
        return `<mark class="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">${match}</mark>`;
      });
    } catch {
      return testString;
    }
  }, [pattern, flags, testString, error]);

  return (
    <ToolPageLayout title="正则测试" href="/dev-tools/regex-tester">
      <div className="mb-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">正则表达式</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-muted text-muted-foreground">
                /
              </span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 p-2 border bg-background font-mono"
                placeholder="输入正则表达式"
              />
              <span className="inline-flex items-center px-3 border border-l-0 rounded-r-lg bg-muted text-muted-foreground">
                /
              </span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-20 p-2 border rounded-r-lg bg-background font-mono"
                placeholder="标志"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">测试字符串</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder="输入要测试的字符串"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">匹配结果</label>
          <div
            className="w-full h-64 p-4 border rounded-lg overflow-auto bg-background whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedText || "" }}
          />
        </div>
      </div>

      {results && results.length > 0 && (
        <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
          <h3 className="font-semibold mb-2">匹配详情</h3>
          <div className="text-sm">
            找到 <span className="font-bold text-primary">{results.length}</span> 个匹配:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {results.map((match, i) => (
              <span key={i} className="px-2 py-1 bg-primary/20 rounded text-sm font-mono">
                {match}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">常用标志说明</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div><code className="text-primary">g</code> - 全局匹配</div>
          <div><code className="text-primary">i</code> - 忽略大小写</div>
          <div><code className="text-primary">m</code> - 多行模式</div>
          <div><code className="text-primary">s</code> - .匹配换行</div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
