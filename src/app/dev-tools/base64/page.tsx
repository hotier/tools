"use client";

import { useState, useEffect } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/Button";

export default function Base64Page() {
  useTrackToolUsage("/dev-tools/base64", "Base64 编解码");
  const { showToast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [loadSample, setLoadSample] = useState(false);

  // 监听 loadSample 状态，当为 true 时加载示例数据并执行转换
  useEffect(() => {
    if (loadSample) {
      let sampleData = "";
      if (mode === "encode") {
        sampleData = "Hello, Base64 encoding!";
      } else {
        sampleData = "SGVsbG8sIEJhc2U2NCBlbmNvZGluZyE=";
      }
      setInput(sampleData);
      
      // 直接处理转换，使用样本数据而不是依赖状态更新
      try {
        if (mode === "encode") {
          setOutput(btoa(unescape(encodeURIComponent(sampleData))));
        } else {
          setOutput(decodeURIComponent(escape(atob(sampleData))));
        }
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "处理错误");
        setOutput("");
      }
      
      // 重置 loadSample 状态
      setLoadSample(false);
    }
  }, [loadSample, mode]);

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "编码错误");
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "解码错误，请检查输入是否为有效的 Base64 字符串");
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError("请输入数据");
      setOutput("");
      return;
    }
    if (mode === "encode") {
      encode();
    } else {
      decode();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    showToast("复制成功");
  };

  const loadSampleData = () => {
    setLoadSample(true);
  };

  return (
    <ToolPageLayout title="Base64 编解码" href="/dev-tools/base64">
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <div className="flex rounded-lg border overflow-hidden">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 text-sm ${mode === "encode" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            编码
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 text-sm ${mode === "decode" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            解码
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === "encode" ? "原始文本" : "Base64 字符串"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder={mode === "encode" ? "输入要编码的文本" : "输入 Base64 字符串"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === "encode" ? "Base64 结果" : "解码结果"}
          </label>
          {error ? (
            <div className="w-full h-96 p-4 border rounded-lg bg-red-500/10 text-red-500 overflow-auto">
              {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
              placeholder="结果将显示在这里"
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={handleConvert}
          variant="primary"
          disabled={!input}
        >
          {mode === "encode" ? "编码" : "解码"}
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
