"use client";

import { useState, useEffect } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/Button";

export default function TimestampPage() {
  useTrackToolUsage("/converters/timestamp", "时间戳转换");
  const { showToast } = useToast();
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [inputDateTime, setInputDateTime] = useState("");
  const [outputDateTime, setOutputDateTime] = useState("");
  const [outputTimestamp, setOutputTimestamp] = useState("");

  useEffect(() => {
    const updateTimestamp = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    };
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const dateTimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    setInputDateTime(dateTimeStr);
    setOutputTimestamp(Math.floor(now.getTime() / 1000).toString());
  }, []);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const parseDateTime = (dateTime: string) => {
    const match = dateTime.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, year, month, day, hours, minutes, seconds] = match.map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return Math.floor(date.getTime() / 1000);
  };

  const handleTimestampChange = (value: string) => {
    setInputTimestamp(value);
    const ts = parseInt(value);
    if (!isNaN(ts) && value.length > 0) {
      setOutputDateTime(formatDateTime(ts));
    } else {
      setOutputDateTime("");
    }
  };

  const handleDateTimeChange = (value: string) => {
    setInputDateTime(value);
    const ts = parseDateTime(value);
    if (ts !== null) {
      setOutputTimestamp(ts.toString());
    } else {
      setOutputTimestamp("");
    }
  };

  const setCurrentAsInput = () => {
    setInputTimestamp(currentTimestamp.toString());
    setOutputDateTime(formatDateTime(currentTimestamp));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showToast("复制成功");
  };

  return (
    <ToolPageLayout title="时间戳转换" href="/converters/timestamp">
      <div className="mb-6 p-4 bg-primary/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">当前时间戳（东八区）</span>
            <div className="text-2xl font-mono font-bold text-primary">{currentTimestamp}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {formatDateTime(currentTimestamp)} (UTC+8)
            </div>
          </div>
          <Button
            onClick={setCurrentAsInput}
            variant="primary"
          >
            使用当前时间
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">时间戳 → 日期时间</h3>
          <div>
            <label className="block text-sm font-medium mb-2">输入时间戳（秒）</label>
            <input
              type="text"
              value={inputTimestamp}
              onChange={(e) => handleTimestampChange(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono bg-background"
              placeholder="输入秒级时间戳"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">毫秒时间戳</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputTimestamp ? (parseInt(inputTimestamp) * 1000).toString() : ""}
                readOnly
                className="flex-1 p-3 border rounded-lg font-mono bg-muted"
              />
              <Button
                onClick={() => copyToClipboard(inputTimestamp ? (parseInt(inputTimestamp) * 1000).toString() : "")}
                disabled={!inputTimestamp}
                variant="secondary"
              >
                复制
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">东八区时间</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={outputDateTime}
                readOnly
                className="flex-1 p-3 border rounded-lg font-mono bg-muted"
                placeholder="转换后的日期时间"
              />
              <Button
                onClick={() => copyToClipboard(outputDateTime)}
                disabled={!outputDateTime}
                variant="secondary"
              >
                复制
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">日期时间 → 时间戳</h3>
          <div>
            <label className="block text-sm font-medium mb-2">输入日期时间（东八区）</label>
            <input
              type="text"
              value={inputDateTime}
              onChange={(e) => handleDateTimeChange(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono bg-background"
              placeholder="格式: 2024-01-01 12:00:00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">秒级时间戳</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={outputTimestamp}
                readOnly
                className="flex-1 p-3 border rounded-lg font-mono bg-muted"
                placeholder="转换后的时间戳"
              />
              <Button
                onClick={() => copyToClipboard(outputTimestamp)}
                disabled={!outputTimestamp}
                variant="secondary"
              >
                复制
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">毫秒时间戳</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={outputTimestamp ? (parseInt(outputTimestamp) * 1000).toString() : ""}
                readOnly
                className="flex-1 p-3 border rounded-lg font-mono bg-muted"
              />
              <Button
                onClick={() => copyToClipboard(outputTimestamp ? (parseInt(outputTimestamp) * 1000).toString() : "")}
                disabled={!outputTimestamp}
                variant="secondary"
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
