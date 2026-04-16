"use client";

import { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";

interface ParsedInterval {
  original: string;
  formatted: string;
  lowerBound: number | null;
  upperBound: number | null;
  lowerOperator: string;
  upperOperator: string;
  error?: string;
}

interface ParsedResult {
  lowerDisplay: string | null;
  upperDisplay: string | null;
  lowerType: string;
  upperType: string;
  isCustomLower: boolean;
  isCustomUpper: boolean;
}

function parseSingleInterval(
  input: string,
  precision: number,
  customLowerStr: string | null,
  customUpperStr: string | null
): ParsedInterval & ParsedResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      original: input,
      formatted: "",
      lowerBound: null,
      upperBound: null,
      lowerOperator: "",
      upperOperator: "",
      error: "空输入",
      lowerDisplay: null,
      upperDisplay: null,
      lowerType: "无",
      upperType: "无",
      isCustomLower: false,
      isCustomUpper: false,
    };
  }

  const patterns = [
    /([0-9.]+%?)\s*([<>]|<=|>=)\s*([a-zA-Z])\s*([<>]|<=|>=)\s*([0-9.]+%?)/i,
    /([0-9.]+%?)\s*([<>]|<=|>=)\s*([0-9.]+%?)/i,
    /([a-zA-Z])\s*([<>]|<=|>=)\s*([0-9.]+%?)/i,
    /([0-9.]+%?)\s*([<>]|<=|>=)\s*([a-zA-Z])/i,
  ];

  const normalizeOperator = (op: string): string => {
    switch (op) {
      case "<=": return "≤";
      case ">=": return "≥";
      default: return op;
    }
  };

  const toOutputOperator = (op: string): string => {
    switch (op) {
      case "≤": return "<=";
      case "≥": return ">=";
      default: return op;
    }
  };

  const normalizeExpression = (expr: string): string => {
    let normalized = expr
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/≤/g, "<=")
      .replace(/≥/g, ">=");
    
    normalized = normalized.replace(/([0-9.]+)%/g, (_, num) => {
      const value = parseFloat(num) / 100;
      return value.toString();
    });
    
    return normalized;
  };

  const formatted = normalizeExpression(trimmed);

  let result: ParsedInterval = {
    original: input,
    formatted: formatted,
    lowerBound: null,
    upperBound: null,
    lowerOperator: "",
    upperOperator: "",
  };

  const reverseOperator = (op: string): string => {
    const normalized = normalizeOperator(op);
    switch (normalized) {
      case "<": return ">";
      case "≤": return ">=";
      case ">": return "<";
      case "≥": return "<=";
      default: return normalized;
    }
  };

  const match1 = formatted.match(patterns[0]);
  if (match1) {
    const [, left, op1, , op2, right] = match1;
    const leftVal = parseFloat(left);
    const rightVal = parseFloat(right);
    const normOp1 = normalizeOperator(op1);
    const normOp2 = normalizeOperator(op2);

    const op1IsLower = normOp1 === "<" || normOp1 === "≤";
    const op1IsUpper = normOp1 === ">" || normOp1 === "≥";
    const op2IsLower = normOp2 === ">" || normOp2 === "≥";
    const op2IsUpper = normOp2 === "<" || normOp2 === "≤";

    if (op1IsLower && op2IsUpper) {
      result.lowerBound = leftVal;
      result.lowerOperator = reverseOperator(op1);
      result.upperBound = rightVal;
      result.upperOperator = toOutputOperator(normOp2);
    } else if (op1IsUpper && op2IsLower) {
      result.lowerBound = rightVal;
      result.lowerOperator = toOutputOperator(normOp2);
      result.upperBound = leftVal;
      result.upperOperator = reverseOperator(op1);
    } else if (op1IsUpper && op2IsUpper) {
      if (leftVal < rightVal) {
        result.upperBound = leftVal;
        result.upperOperator = reverseOperator(op1);
      } else if (rightVal < leftVal) {
        result.upperBound = rightVal;
        result.upperOperator = toOutputOperator(normOp2);
      } else {
        const op1Closed = normOp1 === "≥";
        const op2Closed = normOp2 === "≤";
        if (op1Closed && op2Closed) {
          result.upperBound = leftVal;
          result.upperOperator = "<=";
        } else {
          result.upperBound = leftVal;
          result.upperOperator = "<";
        }
      }
    } else if (op1IsLower && op2IsLower) {
      if (leftVal > rightVal) {
        result.lowerBound = leftVal;
        result.lowerOperator = reverseOperator(op1);
      } else if (rightVal > leftVal) {
        result.lowerBound = rightVal;
        result.lowerOperator = toOutputOperator(normOp2);
      } else {
        const op1Closed = normOp1 === "≤";
        const op2Closed = normOp2 === "≥";
        if (op1Closed && op2Closed) {
          result.lowerBound = leftVal;
          result.lowerOperator = ">=";
        } else {
          result.lowerBound = leftVal;
          result.lowerOperator = ">";
        }
      }
    }
  } else {
    const match2 = formatted.match(patterns[1]);
    if (match2) {
      const [, left, op, right] = match2;
      const leftVal = parseFloat(left);
      const rightVal = parseFloat(right);
      const normOp = normalizeOperator(op);

      if (normOp === "<" || normOp === "≤") {
        result.lowerBound = leftVal;
        result.lowerOperator = reverseOperator(op);
        result.upperBound = rightVal;
        result.upperOperator = "";
      } else {
        result.lowerBound = rightVal;
        result.lowerOperator = "";
        result.upperBound = leftVal;
        result.upperOperator = reverseOperator(op);
      }
    } else {
      const match3 = formatted.match(patterns[2]);
      if (match3) {
        const [, , op, val] = match3;
        const value = parseFloat(val);
        const normOp = normalizeOperator(op);

        if (normOp === "<" || normOp === "≤") {
          result.upperBound = value;
          result.upperOperator = toOutputOperator(normOp);
        } else {
          result.lowerBound = value;
          result.lowerOperator = toOutputOperator(normOp);
        }
      } else {
        const match4 = formatted.match(patterns[3]);
        if (match4) {
          const [, val, op] = match4;
          const value = parseFloat(val);
          const normOp = normalizeOperator(op);

          if (normOp === "<" || normOp === "≤") {
            result.lowerBound = value;
            result.lowerOperator = reverseOperator(op);
          } else {
            result.upperBound = value;
            result.upperOperator = reverseOperator(op);
          }
        } else {
          return {
            ...result,
            error: "无法识别的格式",
            lowerDisplay: null,
            upperDisplay: null,
            lowerType: "无",
            upperType: "无",
            isCustomLower: false,
            isCustomUpper: false,
          };
        }
      }
    }
  }

  if (result.lowerBound !== null && result.upperBound !== null) {
    if (result.lowerBound > result.upperBound) {
      return {
        ...result,
        error: "区间逻辑错误：下限不能大于上限",
        lowerDisplay: null,
        upperDisplay: null,
        lowerType: "无",
        upperType: "无",
        isCustomLower: false,
        isCustomUpper: false,
      };
    }
    if (result.lowerBound === result.upperBound) {
      const isLowerClosed = result.lowerOperator === ">=";
      const isUpperClosed = result.upperOperator === "<=";
      if (!isLowerClosed || !isUpperClosed) {
        return {
          ...result,
          error: "区间逻辑错误：当上下限相等时，必须均为闭区间",
          lowerDisplay: null,
          upperDisplay: null,
          lowerType: "无",
          upperType: "无",
          isCustomLower: false,
          isCustomUpper: false,
        };
      }
    }
  }

  const parseCustomValue = (
    customValueStr: string | null
  ): { value: number | null; error: string | null } => {
    if (!customValueStr || !customValueStr.trim()) {
      return { value: null, error: null };
    }

    const trimmedCustom = customValueStr.trim();
    const hasCustomPercent = trimmedCustom.includes("%");
    let customNum = parseFloat(trimmedCustom.replace("%", ""));

    if (isNaN(customNum)) {
      return { value: null, error: "自定义值格式无效" };
    }

    if (hasCustomPercent) {
      customNum = customNum / 100;
    }

    return { value: customNum, error: null };
  };

  const validateCustomBounds = (
    lowerBound: number | null,
    lowerOperator: string,
    upperBound: number | null,
    upperOperator: string,
    customLowerValue: number | null,
    customUpperValue: number | null
  ): string | null => {
    if (lowerBound !== null && upperBound === null && customUpperValue !== null) {
      if (lowerOperator === ">") {
        if (customUpperValue <= lowerBound) {
          return `上限必须大于${lowerBound}`;
        }
      } else if (lowerOperator === "≥") {
        if (customUpperValue < lowerBound) {
          return `上限必须大于等于${lowerBound}`;
        }
      }
    }

    if (upperBound !== null && lowerBound === null && customLowerValue !== null) {
      if (upperOperator === "<") {
        if (customLowerValue >= upperBound) {
          return `下限必须小于${upperBound}`;
        }
      } else if (upperOperator === "≤") {
        if (customLowerValue > upperBound) {
          return `下限必须小于等于${upperBound}`;
        }
      }
    }

    return null;
  };

  const needsCustomLower = result.upperBound !== null && result.lowerBound === null;
  const needsCustomUpper = result.lowerBound !== null && result.upperBound === null;

  const customLowerParsed = parseCustomValue(customLowerStr);
  const customUpperParsed = parseCustomValue(customUpperStr);

  if (customLowerParsed.error) {
    return {
      ...result,
      error: customLowerParsed.error,
      lowerDisplay: null,
      upperDisplay: null,
      lowerType: "无",
      upperType: "无",
      isCustomLower: false,
      isCustomUpper: false,
    };
  }

  if (customUpperParsed.error) {
    return {
      ...result,
      error: customUpperParsed.error,
      lowerDisplay: null,
      upperDisplay: null,
      lowerType: "无",
      upperType: "无",
      isCustomLower: false,
      isCustomUpper: false,
    };
  }

  const validationError = validateCustomBounds(
    result.lowerBound,
    result.lowerOperator,
    result.upperBound,
    result.upperOperator,
    customLowerParsed.value,
    customUpperParsed.value
  );

  if (validationError) {
    return {
      ...result,
      error: validationError,
      lowerDisplay: null,
      upperDisplay: null,
      lowerType: "无",
      upperType: "无",
      isCustomLower: false,
      isCustomUpper: false,
    };
  }

  const formatValue = (
    value: number | null,
    operator: string,
    isLower: boolean,
    customValue: number | null
  ): { display: string | null; isCustom: boolean } => {
    if (value !== null) {
      if (operator === "≤" || operator === "≥" || operator === "<=" || operator === ">=") {
        return { display: `${value}`, isCustom: false };
      }

      if (operator === ">") {
        const adjusted = value + Math.pow(10, -precision);
        return { display: `${adjusted.toFixed(precision)}`, isCustom: false };
      }

      if (operator === "<") {
        const adjusted = value - Math.pow(10, -precision);
        return { display: `${adjusted.toFixed(precision)}`, isCustom: false };
      }

      return { display: `${value}`, isCustom: false };
    }

    if (customValue !== null) {
      return { display: `${customValue}`, isCustom: true };
    }

    return { display: null, isCustom: false };
  };

  const getType = (operator: string, isCustom: boolean): string => {
    if (isCustom) return "自定义";
    if (!operator) return "无";
    if (operator === "<" || operator === ">") return "开区间";
    return "闭区间";
  };

  const lowerResult = formatValue(
    result.lowerBound,
    result.lowerOperator,
    true,
    customLowerParsed.value
  );
  const upperResult = formatValue(
    result.upperBound,
    result.upperOperator,
    false,
    customUpperParsed.value
  );

  return {
    ...result,
    lowerDisplay: lowerResult.display,
    upperDisplay: upperResult.display,
    lowerType: getType(result.lowerOperator, lowerResult.isCustom),
    upperType: getType(result.upperOperator, upperResult.isCustom),
    isCustomLower: lowerResult.isCustom,
    isCustomUpper: upperResult.isCustom,
  };
}

export default function IntervalParserPage() {
  useTrackToolUsage("/converters/interval-parser", "区间解析");
  const { showToast } = useToast();
  const [input, setInput] = useState("1%<x≤5%\n10<x<100\nx≥50");
  const [precision, setPrecision] = useState(3);
  const [customLower, setCustomLower] = useState<string>("");
  const [customUpper, setCustomUpper] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedResults = useMemo(() => {
    const lines = input.split("\n").filter((line) => line.trim());
    const lowerStr = customLower.trim() || null;
    const upperStr = customUpper.trim() || null;
    return lines.map((line) => parseSingleInterval(line, precision, lowerStr, upperStr));
  }, [input, precision, customLower, customUpper]);

  const validResults = parsedResults.filter((r) => !r.error);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showToast("复制成功");
  };

  const exportTxt = () => {
    if (validResults.length === 0) {
      showToast("没有可导出的数据", "error");
      return;
    }

    const content = validResults
      .map((r) => `原始: ${r.original}\n格式化: ${r.formatted}\n下限: ${r.lowerDisplay ?? "无"} (${r.lowerType})\n上限: ${r.upperDisplay ?? "无"} (${r.upperType})\n`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "interval_results.txt";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast("导出成功");
  };

  const exportExcel = () => {
    if (validResults.length === 0) {
      showToast("没有可导出的数据", "error");
      return;
    }

    const data = validResults.map((r) => ({
      "原始表达式": r.original,
      "格式化表达式": r.formatted,
      "下限": r.lowerDisplay ?? "",
      "下限类型": r.lowerType,
      "上限": r.upperDisplay ?? "",
      "上限类型": r.upperType,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "区间解析结果");
    XLSX.writeFile(wb, "interval_results.xlsx");
    showToast("导出成功");
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "txt") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInput(content);
        showToast("导入成功");
      };
      reader.readAsText(file);
    } else if (extension === "xlsx" || extension === "xls") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

          const expressions = jsonData
            .flat()
            .filter((cell) => cell && typeof cell === "string" && cell.trim())
            .join("\n");

          setInput(expressions);
          showToast("导入成功");
        } catch {
          showToast("导入失败，请检查文件格式", "error");
        }
      };
      reader.readAsBinaryString(file);
    } else {
      showToast("不支持的文件格式", "error");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ToolPageLayout title="区间解析" href="/converters/interval-parser">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <label className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 cursor-pointer">
            导入文件
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.xlsx,.xls"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">输入区间表达式（每行一个）</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 border rounded-lg font-mono text-sm bg-background resize-none"
            placeholder="例如：&#10;1%<x≤5%&#10;1<n<10&#10;x≥100" />
          <p className="text-sm text-muted-foreground mt-2">
            支持的符号：&lt;（小于）、&gt;（大于）、≤ 或 &lt;=（小于等于）、≥ 或 &gt;=（大于等于），支持全角符号，变量名支持任意字母（默认x）
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">开区间边界精度（小数位数）</label>
            <input
              type="number"
              min="1"
              max="10"
              value={precision}
              onChange={(e) => setPrecision(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-full p-2 border rounded-lg bg-background"
              placeholder="1-10"
            />
            <p className="text-sm text-muted-foreground mt-2">
              用于调整开区间边界的精度（1-10）
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">自定义下限（单向区间时）</label>
            <input
              type="text"
              value={customLower}
              onChange={(e) => setCustomLower(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background"
              placeholder="例如：0 或 0%"
            />
            <p className="text-sm text-muted-foreground mt-2">
              当表达式无下限时使用
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">自定义上限（单向区间时）</label>
            <input
              type="text"
              value={customUpper}
              onChange={(e) => setCustomUpper(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background"
              placeholder="例如：100 或 100%"
            />
            <p className="text-sm text-muted-foreground mt-2">
              当表达式无上限时使用
            </p>
          </div>
        </div>

        {parsedResults.length > 0 && (
          <div className="space-y-3">
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">原始表达式</th>
                      <th className="px-4 py-3 text-left font-medium">格式化表达式</th>
                      <th className="px-4 py-3 text-left font-medium">下限</th>
                      <th className="px-4 py-3 text-left font-medium">下限类型</th>
                      <th className="px-4 py-3 text-left font-medium">上限</th>
                      <th className="px-4 py-3 text-left font-medium">上限类型</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {parsedResults.map((result, index) => (
                      <tr key={index} className={result.error ? "bg-red-500/5" : ""}>
                        <td className="px-4 py-3 font-mono">{result.original || "(空行)"}</td>
                        <td className="px-4 py-3 font-mono">{result.formatted || "-"}</td>
                        <td className="px-4 py-3 font-mono">
                          {result.error ? (
                            <span className="text-red-500">{result.error}</span>
                          ) : (
                            <span className={result.isCustomLower ? "text-blue-500" : ""}>
                              {result.lowerDisplay ?? "-"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={result.isCustomLower ? "text-blue-500" : ""}>
                            {result.lowerType}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <span className={result.isCustomUpper ? "text-blue-500" : ""}>
                            {result.upperDisplay ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={result.isCustomUpper ? "text-blue-500" : ""}>
                            {result.upperType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  const header = "原始表达式\t格式化表达式\t下限\t下限类型\t上限\t上限类型";
                  const text = parsedResults
                    .filter((r) => !r.error && (r.lowerDisplay || r.upperDisplay))
                    .map((r) => `${r.original}\t${r.formatted}\t${r.lowerDisplay ?? "-"}\t${r.lowerType}\t${r.upperDisplay ?? "-"}\t${r.upperType}`)
                    .join("\n");
                  if (text) {
                    copyToClipboard(`${header}\n${text}`);
                  }
                }}
                disabled={validResults.length === 0}
                className="px-4 py-2 bg-blue-500/10 text-blue-500/70 border border-blue-500/10 rounded-lg hover:bg-blue-500/80 hover:text-white hover:border-blue-500/80 disabled:opacity-50 disabled:hover:bg-blue-500/10 disabled:hover:text-blue-500/70 disabled:hover:border-blue-500/10 transition-all duration-200"
              >
                复制结果
              </button>
              <button
                onClick={exportTxt}
                disabled={validResults.length === 0}
                className="px-4 py-2 bg-green-500/10 text-green-500/70 border border-green-500/10 rounded-lg hover:bg-green-500/80 hover:text-white hover:border-green-500/80 disabled:opacity-50 disabled:hover:bg-green-500/10 disabled:hover:text-green-500/70 disabled:hover:border-green-500/10 transition-all duration-200"
              >
                导出 TXT
              </button>
              <button
                onClick={exportExcel}
                disabled={validResults.length === 0}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-500/70 border border-emerald-500/10 rounded-lg hover:bg-emerald-500/80 hover:text-white hover:border-emerald-500/80 disabled:opacity-50 disabled:hover:bg-emerald-500/10 disabled:hover:text-emerald-500/70 disabled:hover:border-emerald-500/10 transition-all duration-200"
              >
                导出 Excel
              </button>
              <button
                onClick={() => setInput("")}
                className="px-4 py-2 bg-red-500/10 text-red-500/70 border border-red-500/10 rounded-lg hover:bg-red-500/80 hover:text-white hover:border-red-500/80 transition-all duration-200"
              >
                清空
              </button>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 支持格式：1%&lt;x&lt;=5%、1&lt;n&lt;10、x&gt;=100、m&lt;=50 等（变量名支持任意字母）</li>
            <li>• 符号支持：&lt;、&gt;、≤、≥、&lt;=、&gt;=，输入支持全角符号，输出统一为半角格式</li>
            <li>• 每行输入一个区间表达式，支持批量解析</li>
            <li>• 开区间（&lt; 或 &gt;）的边界值会根据精度自动调整</li>
            <li>• 闭区间（&lt;= 或 &gt;=）的边界值保持不变</li>
            <li>• 单向区间（如 x≥50）可设置自定义下限/上限值</li>
            <li>• 自定义值可输入小数或百分比格式，系统自动解析数值进行验证</li>
            <li>• 自定义值需符合区间逻辑（如 x&gt;50 时上限必须大于50）</li>
            <li>• 支持导入 TXT/Excel 文件，导出为 TXT/Excel 格式</li>
          </ul>
        </div>
      </div>
    </ToolPageLayout>
  );
}
