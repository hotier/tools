"use client";

import { useState, useMemo } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegexTesterPage() {
  useTrackToolUsage("/dev-tools/regex-tester", "正则测试");
  const { toast } = useToast();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string>("g");
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

  const loadSampleData = () => {
    // 匹配中国手机号的正则表达式
    setPattern("1[3-9]\\d{9}");
    setFlags("g");
    setTestString(`联系信息:\n张三: 13812345678\n李四: 15987654321\n王五: 18611112222\n赵六: 17733334444\n无效号码: 12345678901\n固定电话: 010-12345678`);
  };

  const clearAll = () => {
    setPattern("");
    setFlags("g");
    setTestString("");
    setError("");
  };

  const copyResults = async () => {
    if (results && results.length > 0) {
      await navigator.clipboard.writeText(results.join("\n"));
      toast.success("复制成功");
    }
  };

  return (
    <ToolPageLayout title="正则测试" href="/dev-tools/regex-tester">
      <div className="mb-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">正则表达式</label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 border rounded-l-lg bg-muted text-muted-foreground h-8">
                /
              </span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 p-2 border border-l-0 border-r-0 bg-background font-mono h-8"
                placeholder="输入正则表达式"
              />
              <span className="inline-flex items-center px-3 border border-l-0 bg-muted text-muted-foreground h-8">
                /
              </span>
              <Select value={flags} onValueChange={(value) => setFlags(value)}>
                <SelectTrigger className="w-24 rounded-l-none rounded-r-lg border-l-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="i">i</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="gi">gi</SelectItem>
                  <SelectItem value="gm">gm</SelectItem>
                  <SelectItem value="im">im</SelectItem>
                  <SelectItem value="gim">gim</SelectItem>
                  <SelectItem value="s">s</SelectItem>
                  <SelectItem value="u">u</SelectItem>
                  <SelectItem value="y">y</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
            className="w-full h-64 p-4 border rounded-lg overflow-auto bg-background whitespace-pre-wrap font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: highlightedText || "" }}
          />
        </div>
      </div>

      {results && results.length > 0 && (
        <div className="mt-4 p-4 bg-secondary/50 rounded-lg mb-6">
          <h3 className="font-semibold mb-2 text-sm">匹配详情</h3>
          <div className="text-sm">
            找到 <span className="font-bold text-primary">{results.length}</span> 个匹配:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {results.map((match, i) => (
              <span key={i} className="px-2 py-1 bg-yellow-300 dark:bg-yellow-600 rounded text-sm font-mono">
                {match}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => {
            if (!pattern && !testString) {
              loadSampleData();
            } else {
              copyResults();
            }
          }}
          variant={pattern || testString ? "success" : "secondary"}
        >
          {pattern || testString ? "复制结果" : "示例数据"}
        </Button>
        <Button
          onClick={clearAll}
          variant="destructive"
          disabled={!pattern && !testString}
        >
          清空
        </Button>
      </div>
    </ToolPageLayout>
  );
}
