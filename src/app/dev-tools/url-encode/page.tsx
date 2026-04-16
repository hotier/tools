"use client";

import { useState } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";

export default function UrlEncodePage() {
  useTrackToolUsage("/dev-tools/url-encode", "URL 编解码");
  const { showToast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encode = () => {
    setOutput(encodeURIComponent(input));
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setOutput("解码错误：输入不是有效的 URL 编码字符串");
    }
  };

  const handleConvert = () => {
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

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <ToolPageLayout title="URL 编解码" href="/dev-tools/url-encode">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex rounded-lg border overflow-hidden">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 ${mode === "encode" ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            编码
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 ${mode === "decode" ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            解码
          </button>
        </div>
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          {mode === "encode" ? "编码" : "解码"}
        </button>
        <button
          onClick={swap}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90"
        >
          交换
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === "encode" ? "原始文本" : "URL 编码字符串"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder={mode === "encode" ? "输入要编码的文本" : "输入 URL 编码字符串"}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              {mode === "encode" ? "编码结果" : "解码结果"}
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="text-sm text-primary hover:underline"
              >
                复制
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder="结果将显示在这里"
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
