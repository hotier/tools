"use client";

import { useState, useEffect } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/Button";

export default function UrlEncodePage() {
  useTrackToolUsage("/dev-tools/url-encode", "URL 编解码");
  const { showToast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeSpecialChars, setEncodeSpecialChars] = useState(false); // 是否编码特殊符号，默认不勾选
  const [loadSample, setLoadSample] = useState(false);

  // 监听 loadSample 状态，当为 true 时加载示例数据并执行转换
  useEffect(() => {
    if (loadSample) {
      let sampleData = "";
      if (mode === "encode") {
        sampleData = "https://www.example.com/search?q=URL encoding&category=tools&page=1";
      } else {
        sampleData = "https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3DURL%20encoding%26category%3Dtools%26page%3D1";
      }
      setInput(sampleData);
      
      // 直接处理转换，使用样本数据而不是依赖状态更新
      if (mode === "encode") {
        setOutput(encodeSpecialChars ? encodeURIComponent(sampleData) : encodeURI(sampleData));
      } else {
        try {
          setOutput(decodeURIComponent(sampleData));
        } catch (e) {
          setOutput("解码错误：输入不是有效的 URL 编码字符串");
        }
      }
      
      // 重置 loadSample 状态
      setLoadSample(false);
    }
  }, [loadSample, mode, encodeSpecialChars]);

  // 监听 encodeSpecialChars 状态变化，当选项改变时自动更新编码结果
  useEffect(() => {
    if (mode === "encode" && input.trim()) {
      setOutput(encodeSpecialChars ? encodeURIComponent(input) : encodeURI(input));
    }
  }, [encodeSpecialChars, mode, input]);

  const encode = () => {
    setOutput(encodeSpecialChars ? encodeURIComponent(input) : encodeURI(input));
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setOutput("解码错误：输入不是有效的 URL 编码字符串");
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput("请输入数据");
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
    <ToolPageLayout title="URL 编解码" href="/dev-tools/url-encode">
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
            {mode === "encode" ? "原始文本" : "URL 编码字符串"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder={mode === "encode" ? "输入要编码的文本" : "输入 URL 编码字符串"}
          />
        </div>
        <div>
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm font-medium">
              {mode === "encode" ? "编码结果" : "解码结果"}
            </label>
            {mode === "encode" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="encode-special-chars"
                  checked={encodeSpecialChars}
                  onChange={(e) => setEncodeSpecialChars(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="encode-special-chars" className="text-sm">
                  编码特殊符号
                </label>
              </div>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder="结果将显示在这里"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={handleConvert}
          variant="primary"
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
          }}
          variant="danger"
        >
          清空
        </Button>
      </div>
    </ToolPageLayout>
  );
}
