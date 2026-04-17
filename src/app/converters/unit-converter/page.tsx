"use client";

import { useState } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  area: [
    { name: "平方米", toBase: (v) => v, fromBase: (v) => v },
    { name: "平方千米", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { name: "平方厘米", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { name: "平方毫米", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: "平方英寸", toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
    { name: "平方英尺", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { name: "平方码", toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
    { name: "英亩", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
  ],
  volume: [
    { name: "立方米", toBase: (v) => v, fromBase: (v) => v },
    { name: "立方分米", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "立方厘米", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: "升", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "毫升", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: "立方英寸", toBase: (v) => v * 0.0000163871, fromBase: (v) => v / 0.0000163871 },
    { name: "立方英尺", toBase: (v) => v * 0.0283168, fromBase: (v) => v / 0.0283168 },
    { name: "加仑", toBase: (v) => v * 0.00378541, fromBase: (v) => v / 0.00378541 },
  ],
  time: [
    { name: "秒", toBase: (v) => v, fromBase: (v) => v },
    { name: "分钟", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { name: "小时", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { name: "天", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { name: "周", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    { name: "月", toBase: (v) => v * 2628000, fromBase: (v) => v / 2628000 },
    { name: "年", toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
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
    // 只在输入是有效数字时进行转换
    const num = parseFloat(value);
    if (!isNaN(num) && value.trim() !== "") {
      setToValue(convert(value, fromUnit, toUnit));
    } else {
      setToValue("");
    }
  };

  const handleFromUnitChange = (unit: number) => {
    setFromUnit(unit);
    const num = parseFloat(fromValue);
    if (!isNaN(num) && fromValue.trim() !== "") {
      setToValue(convert(fromValue, unit, toUnit));
    } else {
      setToValue("");
    }
  };

  const handleToUnitChange = (unit: number) => {
    setToUnit(unit);
    const num = parseFloat(fromValue);
    if (!isNaN(num) && fromValue.trim() !== "") {
      setToValue(convert(fromValue, fromUnit, unit));
    } else {
      setToValue("");
    }
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
    area: "面积",
    volume: "体积",
    time: "时间",
  };

  return (
    <ToolPageLayout title="单位换算" href="/converters/unit-converter">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">选择类型</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(units) as Category[]).map((cat) => (
            <Button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setFromUnit(0);
                setToUnit(1);
                const num = parseFloat(fromValue);
                if (!isNaN(num) && fromValue.trim() !== "") {
                  setToValue(convert(fromValue, 0, 1));
                } else {
                  setToValue("");
                }
              }}
              variant={category === cat ? "default" : "secondary"}
              size="sm"
            >
              {categoryNames[cat]}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">从</label>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => handleFromChange(e.target.value)}
                className="flex-1 h-10 p-2 border rounded-lg bg-background"
              />
              <Select value={fromUnit.toString()} onValueChange={(value) => handleFromUnitChange(Number(value))}>
                <SelectTrigger className="w-full sm:w-32 !h-10">
                  <SelectValue placeholder="选择单位" />
                </SelectTrigger>
                <SelectContent>
                  {units[category].map((unit, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={swapUnits}
            variant="outline"
            size="icon"
            className="flex-shrink-0 !h-10 !w-10"
            aria-label="交换单位"
          >
            <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2652" width="20" height="20">
              <path d="M112 512c0-40.96 6.4-81.92 19.2-122.24a397.504 397.504 0 0 1 197.76-233.6 398.72 398.72 0 0 1 305.28-25.6c51.2 16.64 97.28 42.88 136.96 76.8H704c-26.24 0-48 21.76-48 48s21.76 48 48 48h192c26.24 0 48-21.76 48-48V64c0-26.24-21.76-48-48-48s-48 21.76-48 48v83.2c-53.12-49.28-115.2-85.12-184.96-107.52C537.6 0 403.2 10.24 285.44 71.04S80 234.88 39.68 360.96C23.68 410.24 16 460.8 16 512c0 26.24 21.76 48 48 48s48-21.76 48-48zM1002.88 440.96a47.424 47.424 0 0 0-54.4-40.32c-26.24 3.84-44.16 28.16-40.32 54.4 8.96 60.16 3.84 120.32-15.36 179.2a397.504 397.504 0 0 1-197.76 233.6 398.72 398.72 0 0 1-305.28 25.6 396.16 396.16 0 0 1-136.96-76.8H320c26.24 0 48-21.76 48-48s-21.76-48-48-48H128c-26.24 0-48 21.76-48 48v192c0 26.24 21.76 48 48 48s48-21.76 48-48v-83.2c53.12 49.28 115.2 85.12 184.96 107.52 49.92 16 101.12 23.68 151.68 23.68 78.08 0 154.88-18.56 226.56-55.04a491.52 491.52 0 0 0 245.12-289.92c23.04-72.32 29.44-147.2 18.56-222.08z" p-id="2653"></path>
            </svg>
          </Button>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">到</label>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <input
                type="text"
                value={toValue}
                readOnly
                className="flex-1 h-10 p-2 border rounded-lg bg-muted"
              />
              <Select value={toUnit.toString()} onValueChange={(value) => handleToUnitChange(Number(value))}>
                <SelectTrigger className="w-full sm:w-32 !h-10">
                  <SelectValue placeholder="选择单位" />
                </SelectTrigger>
                <SelectContent>
                  {units[category].map((unit, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
