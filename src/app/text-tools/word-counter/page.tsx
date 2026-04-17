"use client";

import { useState, useMemo } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/Button";

export default function WordCounterPage() {
  useTrackToolUsage("/text-tools/word-counter", "字数统计");
  const { showToast } = useToast();
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const charCount = text.length;
    const charCountNoSpace = text.replace(/\s/g, "").length;
    const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (text.match(/[0-9]/g) || []).length;
    const punctuationCount = (text.match(/[，。！？、；：""''（）【】《》,.!?;:'"()\[\]<>]/g) || []).length;
    const lineCount = text ? text.split("\n").length : 0;
    const nonEmptyLineCount = text ? text.split("\n").filter((line) => line.trim()).length : 0;
    const wordCount = (text.trim().match(/[a-zA-Z]+/g) || []).length;
    const paragraphCount = text ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;

    return {
      charCount,
      charCountNoSpace,
      chineseCount,
      englishCount,
      numberCount,
      punctuationCount,
      lineCount,
      nonEmptyLineCount,
      wordCount,
      paragraphCount,
    };
  }, [text]);

  const copyStats = async () => {
    const statsText = `字符数：${stats.charCount}
字符数（不含空格）：${stats.charCountNoSpace}
中文字数：${stats.chineseCount}
英文字母：${stats.englishCount}
数字字符：${stats.numberCount}
标点符号：${stats.punctuationCount}
行数：${stats.lineCount}
非空行数：${stats.nonEmptyLineCount}
单词数：${stats.wordCount}
段落数：${stats.paragraphCount}`;
    await navigator.clipboard.writeText(statsText);
    showToast("复制成功");
  };

  const loadSampleData = () => {
    const sampleText = `这是一段示例文本，用于演示字数统计功能。

The quick brown fox jumps over the lazy dog.
这是一只快速的棕色狐狸跳过了懒惰的狗。

数字统计：12345，67890。
标点符号：，。！？、；：""''（）【】《》

多段落测试：
第一段内容。
第二段内容。`;
    setText(sampleText);
  };

  return (
    <ToolPageLayout title="字数统计" href="/text-tools/word-counter">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">输入文本</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-80 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder="在此输入或粘贴文本..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">统计结果</label>
          <div className="h-80 p-4 border rounded-lg bg-card overflow-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.charCount}</div>
                <div className="text-sm text-muted-foreground">字符数</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.charCountNoSpace}</div>
                <div className="text-sm text-muted-foreground">字符数（不含空格）</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.chineseCount}</div>
                <div className="text-sm text-muted-foreground">中文字数</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.englishCount}</div>
                <div className="text-sm text-muted-foreground">英文字母</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.numberCount}</div>
                <div className="text-sm text-muted-foreground">数字字符</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.punctuationCount}</div>
                <div className="text-sm text-muted-foreground">标点符号</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.lineCount}</div>
                <div className="text-sm text-muted-foreground">行数</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.nonEmptyLineCount}</div>
                <div className="text-sm text-muted-foreground">非空行数</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.wordCount}</div>
                <div className="text-sm text-muted-foreground">单词数</div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{stats.paragraphCount}</div>
                <div className="text-sm text-muted-foreground">段落数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => {
            if (text) {
              copyStats();
            } else {
              loadSampleData();
            }
          }}
          variant={text ? "success" : "secondary"}
        >
          {text ? "复制结果" : "示例数据"}
        </Button>
        <Button onClick={() => setText("")} variant="danger" disabled={!text}>
          清空
        </Button>
      </div>
    </ToolPageLayout>
  );
}
