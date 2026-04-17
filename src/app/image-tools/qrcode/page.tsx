"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Button } from "@/components/ui/button";

export default function QRCodePage() {
  useTrackToolUsage("/image-tools/qrcode", "二维码生成");
  const [text, setText] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [previewSize] = useState(224);
  const [downloadSize, setDownloadSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<"L" | "M" | "Q" | "H">("M");

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, {
        width: previewSize,
        errorCorrectionLevel,
        margin: 2,
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [text, previewSize, errorCorrectionLevel]);

  const downloadQR = async () => {
    const fullSizeUrl = await QRCode.toDataURL(text, {
      width: downloadSize,
      errorCorrectionLevel,
      margin: 2,
    });
    const timestamp = Math.floor(Date.now() / 1000);
    const link = document.createElement("a");
    link.download = `qrcode_${timestamp}_${downloadSize}.png`;
    link.href = fullSizeUrl;
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
            <label className="block text-sm font-medium mb-2">下载尺寸: {downloadSize}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={downloadSize}
              onChange={(e) => setDownloadSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">容错级别</label>
            <div className="flex gap-2">
              {(["L", "M", "Q", "H"] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => setErrorCorrectionLevel(level)}
                  variant={errorCorrectionLevel === level ? "info" : "secondary"}
                >
                  {level}
                </Button>
              ))}
            </div>
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
            <Button
              onClick={downloadQR}
              variant="default"
              className="mt-4"
            >
              下载二维码
            </Button>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}