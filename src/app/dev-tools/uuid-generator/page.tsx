"use client";

import { useState, useEffect, useRef } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function UUIDGeneratorPage() {
  useTrackToolUsage("/dev-tools/uuid-generator", "UUID 生成器");
  const { toast } = useToast();
  const [uuids, setUuids] = useState<string[]>([]);
  const [rawUuids, setRawUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const isInitialMount = useRef(true);

  const generateUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      const v = c === "y" ? (r & 0x3) | 0x8 : r;
      return v.toString(16);
    });
  };

  const formatUuid = (uuid: string): string => {
    let result = uuid;
    if (noDashes) {
      result = result.replace(/-/g, "");
    }
    if (uppercase) {
      result = result.toUpperCase();
    }
    return result;
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (rawUuids.length > 0) {
      setUuids(rawUuids.map(formatUuid));
    }
  }, [uppercase, noDashes]);

  const generate = () => {
    const newRawUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newRawUuids.push(generateUUID());
    }
    setRawUuids(newRawUuids);
    setUuids(newRawUuids.map(formatUuid));
  };

  const copyAll = async () => {
    if (uuids.length === 0) {
      toast.error("没有可复制的内容");
      return;
    }
    await navigator.clipboard.writeText(uuids.join("\n"));
    toast.success("复制成功");
  };

  const copySingle = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    toast.success("复制成功");
  };

  return (
    <ToolPageLayout title="UUID 生成器" href="/dev-tools/uuid-generator">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">生成数量：</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))} 
              className="w-20 h-10 p-2 border rounded-lg font-mono text-sm bg-background"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">大写</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={noDashes}
              onChange={(e) => setNoDashes(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">无连字符</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button onClick={generate} variant="info">
          生成
        </Button>
        <Button onClick={copyAll} variant="success" disabled={uuids.length === 0}>
          复制全部
        </Button>
        <Button onClick={() => setUuids([])} variant="destructive" disabled={uuids.length === 0}>
          清空
        </Button>
      </div>

      {uuids.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-medium w-12">#</th>
                  <th className="px-4 py-3 text-left font-medium">UUID</th>
                  <th className="px-4 py-3 text-center font-medium w-20">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {uuids.map((uuid, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3 font-mono">{uuid}</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        onClick={() => copySingle(uuid)}
                        variant="success"
                        size="sm"
                      >
                        复制
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
