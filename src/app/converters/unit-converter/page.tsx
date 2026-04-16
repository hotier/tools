"use client";

import { useState } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";

const units: Record<string, { name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { name: "米", toBase: (v) => v, fromBase: (v) => v },
    { name: "千米", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: "厘米", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: "毫米", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "英寸", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { name: "英尺", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: "码", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: "英里", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { name: "克", toBase: (v) => v, fromBase: (v) => v },
    { name: "千克", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: "毫克", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "吨", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { name: "盎司", toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
    { name: "磅", toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
  ],
  temperature: [
    { name: "摄氏度", toBase: (v) => v, fromBase: (v) => v },
    { name: "华氏度", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { name: "开尔文", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
};

type Category = keyof typeof units;

export default function UnitConverterPage() {
  useTrackToolUsage("/converters/unit-converter", "单位换算");
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");

  const convert = (value: string, from: number, to: number) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const baseValue = units[category][from].toBase(num);
    return units[category][to].fromBase(baseValue).toFixed(6).replace(/\.?0+$/, "");
  };

  const handleFromChange = (value: string) => {
    setFromValue(value);
    setToValue(convert(value, fromUnit, toUnit));
  };

  const handleFromUnitChange = (unit: number) => {
    setFromUnit(unit);
    setToValue(convert(fromValue, unit, toUnit));
  };

  const handleToUnitChange = (unit: number) => {
    setToUnit(unit);
    setToValue(convert(fromValue, fromUnit, unit));
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const categoryNames: Record<Category, string> = {
    length: "长度",
    weight: "重量",
    temperature: "温度",
  };

  return (
    <ToolPageLayout title="单位换算" href="/converters/unit-converter">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">选择类型</label>
        <div className="flex gap-2">
          {(Object.keys(units) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setFromUnit(0);
                setToUnit(1);
                setToValue(convert(fromValue, 0, 1));
              }}
              className={`px-4 py-2 rounded ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {categoryNames[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div>
          <label className="block text-sm font-medium mb-2">从</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              className="flex-1 p-3 border rounded-lg bg-background"
            />
            <select
              value={fromUnit}
              onChange={(e) => handleFromUnitChange(Number(e.target.value))}
              className="w-32 p-3 border rounded-lg bg-background"
            >
              {units[category].map((unit, i) => (
                <option key={i} value={i}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center lg:pt-7">
          <button
            onClick={swapUnits}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
            </svg>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">到</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={toValue}
              readOnly
              className="flex-1 p-3 border rounded-lg bg-muted"
            />
            <select
              value={toUnit}
              onChange={(e) => handleToUnitChange(Number(e.target.value))}
              className="w-32 p-3 border rounded-lg bg-background"
            >
              {units[category].map((unit, i) => (
                <option key={i} value={i}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
