"use client";

import { useState, useEffect } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JsonFormatterPage() {
  useTrackToolUsage("/dev-tools/json-formatter", "JSON 格式化");
  const { toast } = useToast();
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
    toast.success("复制成功");
  };

  return (
    <ToolPageLayout title="JSON 格式化" href="/dev-tools/json-formatter">
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <div className="flex rounded-lg border overflow-hidden">
          <Button
            onClick={() => setMode("format")}
            variant="tab"
            size="sm"
            className={mode === "format" ? "!bg-primary !text-primary-foreground rounded-none border-0 rounded-l-lg" : "rounded-none border-0 rounded-l-lg"}
          >
            格式化
          </Button>
          <Button
            onClick={() => setMode("minify")}
            variant="tab"
            size="sm"
            className={mode === "minify" ? "!bg-primary !text-primary-foreground rounded-none border-0 rounded-r-lg" : "rounded-none border-0 rounded-r-lg"}
          >
            压缩
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">缩进空格数</span>
          <Select value={indent.toString()} onValueChange={(value) => setIndent(Number(value))}>
            <SelectTrigger className="w-20 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
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
          variant="info"
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
          variant="destructive"
          disabled={!input}
        >
          清空
        </Button>
      </div>
    </ToolPageLayout>
  );
}
