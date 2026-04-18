"use client";

import { useState } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function ColorPickerPage() {
  useTrackToolUsage("/converters/color-picker", "颜色选择器");
  const { toast } = useToast();
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const rgbValue = hexToRgb(value);
      if (rgbValue) {
        setRgb(rgbValue);
        setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
      }
    }
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    const newRgb = { r, g, b };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    const newHsl = { h, s, l };
    setHsl(newHsl);
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbValue);
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("复制成功");
  };

  const handleEyedropperClick = async () => {
    if (!("EyeDropper" in window)) {
      toast.error("您的浏览器不支持取色器功能");
      return;
    }
    try {
      const eyeDropper = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
      const result = await eyeDropper.open();
      handleHexChange(result.sRGBHex);
      toast.success("已获取颜色");
    } catch {
      // user cancelled
    }
  };

  return (
    <ToolPageLayout title="颜色选择器" href="/converters/color-picker">
      <div className="space-y-8 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <div className="text-sm font-medium mb-2">颜色选择器</div>
            <div className="flex gap-2 items-end">
              <div className="relative flex-1 h-10 group cursor-pointer">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none border"
                  style={{ backgroundColor: hex }}
                />
              </div>
              <button
                onClick={handleEyedropperClick}
                className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer text-foreground hover:bg-accent flex-shrink-0"
                title="取色器"
              >
                <svg className="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path d="M988.16 92.16L926.72 30.72c-40.96-40.96-102.4-40.96-143.36 0l-143.36 143.36L573.44 102.4 440.32 240.64l56.32 56.32-389.12 394.24c-25.6 25.6-40.96 61.44-40.96 92.16l-20.48 20.48c-46.08 51.2-46.08 128 0 179.2 20.48 25.6 51.2 40.96 81.92 40.96s66.56-15.36 87.04-35.84l20.48-20.48c35.84 0 66.56-15.36 92.16-40.96l389.12-394.24 56.32 56.32 138.24-138.24-66.56-71.68 143.36-143.36c40.96-40.96 40.96-102.4 0-143.36m-716.8 768c-10.24 10.24-25.6 15.36-35.84 15.36-10.24 0-15.36 0-25.6-5.12L153.6 921.6c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24c-15.36-15.36-15.36-35.84 0-51.2l56.32-51.2c-10.24-20.48-5.12-46.08 10.24-61.44l389.12-394.24 102.4 102.4-389.12 394.24z m0 0" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-2">常用颜色</div>
            <div className="h-10 flex gap-1 overflow-x-auto pb-1">
              {[
                "#ef4444", "#f87171", "#f97316", "#fb923c", "#eab308", "#84cc16", "#22c55e", "#4ade80", "#14b8a6",
                "#06b6d4", "#22d3ee", "#3b82f6", "#60a5fa", "#8b5cf6", "#a78bfa", "#78716c", "#000000"
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => handleHexChange(color)}
                  className="w-9 h-9 border hover:scale-125 transition-transform flex-shrink-0"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1">
            <div className="text-sm font-medium mb-2">HEX</div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="flex-1 h-10 p-2 border rounded-lg font-mono bg-background min-w-0"
              />
              <Button
                onClick={() => copyToClipboard(hex)}
                variant="success"
                size="input-match"
              >
                复制
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium mb-2">RGB</div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={`${rgb.r}, ${rgb.g}, ${rgb.b}`}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(v => parseInt(v.trim()) || 0);
                  if (values.length === 3) {
                    handleRgbChange(values[0], values[1], values[2]);
                  }
                }}
                className="flex-1 h-10 p-2 border rounded-lg font-mono bg-background min-w-0"
                placeholder="r, g, b"
              />
              <Button
                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                variant="success"
                size="input-match"
              >
                复制
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium mb-2">HSL</div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={`${hsl.h}, ${hsl.s}%, ${hsl.l}%`}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(v => {
                    const trimmed = v.trim();
                    return parseInt(trimmed.replace('%', '')) || 0;
                  });
                  if (values.length === 3) {
                    handleHslChange(values[0], values[1], values[2]);
                  }
                }}
                className="flex-1 h-10 p-2 border rounded-lg font-mono bg-background min-w-0"
                placeholder="h, s%, l%"
              />
              <Button
                onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                variant="success"
                size="input-match"
              >
                复制
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}