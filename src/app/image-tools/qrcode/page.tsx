"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function QRCodePage() {
  useTrackToolUsage("/image-tools/qrcode", "二维码生成");
  const [text, setText] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [size, setSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<"L" | "M" | "Q" | "H">("M");

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, {
        width: size,
        errorCorrectionLevel,
        margin: 2,
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [text, size, errorCorrectionLevel]);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <ToolPageLayout title="二维码生成" href="/image-tools/qrcode">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">输入内容</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-4 border rounded-lg bg-background resize-none"
              placeholder="输入要生成二维码的文本或链接"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">尺寸: {size}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">容错级别</label>
            <div className="flex gap-2">
              {(["L", "M", "Q", "H"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setErrorCorrectionLevel(level)}
                  className={`px-4 py-2 rounded ${
                    errorCorrectionLevel === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              L: 7% | M: 15% | Q: 25% | H: 30% 可恢复
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 border rounded-lg bg-white">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="max-w-full" />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-muted-foreground">
                输入内容生成二维码
              </div>
            )}
          </div>
          {qrDataUrl && (
            <button
              onClick={downloadQR}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
            >
              下载二维码
            </button>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
