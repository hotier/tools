"use client";

import { useState, useEffect } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/Button";

export default function JsonFormatterPage() {
  useTrackToolUsage("/dev-tools/json-formatter", "JSON 格式化");
  const { showToast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<"format" | "minify">('format');
  const [loadSample, setLoadSample] = useState(false);

  // 监听 loadSample 状态，当为 true 时加载示例数据并执行转换
  useEffect(() => {
    if (loadSample) {
      const sample = {
        "name": "John Doe",
        "age": 30,
        "isActive": true,
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zipCode": "10001"
        },
        "hobbies": ["reading", "gaming", "coding"]
      };
      const sampleJson = JSON.stringify(sample);
      setInput(sampleJson);
      
      // 直接处理转换，使用样本数据而不是依赖状态更新
      try {
        const parsed = JSON.parse(sampleJson);
        if (mode === 'format') {
          setOutput(JSON.stringify(parsed, null, indent));
        } else {
          setOutput(JSON.stringify(parsed));
        }
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "JSON 解析错误");
        setOutput("");
      }
      
      // 重置 loadSample 状态
      setLoadSample(false);
    }
  }, [loadSample, mode, indent]);

  const loadSampleData = () => {
    setLoadSample(true);
  };

  const handleProcess = () => {
    if (!input.trim()) {
      setError("请输入 JSON 数据");
      setOutput("");
      return;
    }
    if (mode === 'format') {
      formatJson();
    } else {
      minifyJson();
    }
  };

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
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <div className="flex rounded-lg border overflow-hidden">
          <button
            onClick={() => setMode("format")}
            className={`px-4 py-2 text-sm ${mode === "format" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            格式化
          </button>
          <button
            onClick={() => setMode("minify")}
            className={`px-4 py-2 text-sm ${mode === "minify" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            压缩
          </button>
        </div>
        <div className="flex rounded-lg border overflow-hidden">
          <span className="px-2 py-2 text-sm bg-secondary">缩进空格数:</span>
          <div className="border-l">
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="border-0 px-2 py-2 bg-background text-sm focus:outline-none"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
          <label className="block text-sm font-medium mb-2">输出结果</label>
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
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={handleProcess}
          variant="primary"
          disabled={!input}
        >
          转换
        </Button>
        <Button
          onClick={() => {
            if (output) {
              copyToClipboard();
            } else {
              loadSampleData();
            }
          }}
          variant={output ? "success" : "secondary"}
        >
          {output ? "复制结果" : "示例数据"}
        </Button>
        <Button
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
          variant="danger"
          disabled={!input}
        >
          清空
        </Button>
      </div>
    </ToolPageLayout>
  );
}
