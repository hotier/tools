"use client";

import { useState } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";

export default function JsonFormatterPage() {
  useTrackToolUsage("/dev-tools/json-formatter", "JSON 格式化");
  const { showToast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON 解析错误");
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON 解析错误");
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    showToast("复制成功");
  };

  return (
    <ToolPageLayout title="JSON 格式化" href="/dev-tools/json-formatter">
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm">缩进空格数:</span>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="border rounded px-2 py-1 bg-background"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </label>
        <button
          onClick={formatJson}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          格式化
        </button>
        <button
          onClick={minifyJson}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90"
        >
          压缩
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder='{"key": "value"}'
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">输出结果</label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="text-sm text-primary hover:underline"
              >
                复制
              </button>
            )}
          </div>
          {error ? (
            <div className="w-full h-96 p-4 border rounded-lg bg-red-500/10 text-red-500 overflow-auto">
              {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
              placeholder="格式化结果将显示在这里"
            />
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
