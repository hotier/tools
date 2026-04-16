"use client";

import { useState } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";

export default function ColorPickerPage() {
  useTrackToolUsage("/converters/color-picker", "颜色选择器");
  const { showToast } = useToast();
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

  const handleRgbChange = (key: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [key]: value };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (key: "h" | "s" | "l", value: number) => {
    const newHsl = { ...hsl, [key]: value };
    setHsl(newHsl);
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbValue);
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showToast("复制成功");
  };

  return (
    <ToolPageLayout title="颜色选择器" href="/converters/color-picker">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div
            className="w-full h-48 rounded-lg border mb-6"
            style={{ backgroundColor: hex }}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">选择颜色</label>
            <input
              type="color"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full h-12 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">HEX</label>
              <button
                onClick={() => copyToClipboard(hex)}
                className="text-sm text-primary hover:underline"
              >
                复制
              </button>
            </div>
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono bg-background"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">RGB</label>
              <button
                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                className="text-sm text-primary hover:underline"
              >
                复制
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((key) => (
                <div key={key}>
                  <div className="text-xs text-muted-foreground mb-1 uppercase">{key}</div>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb[key]}
                    onChange={(e) => handleRgbChange(key, parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg bg-background"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">HSL</label>
              <button
                onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                className="text-sm text-primary hover:underline"
              >
                复制
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["h", "s", "l"] as const).map((key) => (
                <div key={key}>
                  <div className="text-xs text-muted-foreground mb-1 uppercase">{key}</div>
                  <input
                    type="number"
                    min="0"
                    max={key === "h" ? 360 : 100}
                    value={hsl[key]}
                    onChange={(e) => handleHslChange(key, parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg bg-background"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
