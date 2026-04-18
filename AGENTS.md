<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 项目开发规范

[!important]涉及通用规则的页面及代码，在修改后把通用规则写入此文档

## 工具页面操作按钮规则

所有工具页面中依赖输入内容的操作按钮（如清空、下载、转换、编码、生成、导出等）在输入框没有内容时应处于禁用状态。

### 规则

- 操作按钮必须添加 `disabled` 属性
- 当输入框为空时，按钮应被禁用
- 对于需要处理结果的操作（如导出），还应在没有有效结果时禁用
- 清空按钮变体使用 `variant="danger"`
- 下载/转换/编码/生成/导出按钮变体使用 `variant="primary"` 或 `variant="warning"`

### 代码模式

```tsx
// 输入状态
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [results, setResults] = useState([]);

// 清空按钮
<Button
  onClick={() => setInput("")}
  variant="danger"
  disabled={!input}  // 输入为空时禁用
>
  清空
</Button>

// 下载/转换/编码/生成按钮
<Button
  onClick={handleAction}
  variant="primary"
  disabled={!input || loading}  // 输入为空或加载中时禁用
>
  操作
</Button>

// 导出按钮
<Button
  onClick={handleExport}
  variant="warning"
  disabled={!input || results.length === 0}  // 输入为空或无结果时禁用
>
  导出
</Button>
```

### 适用页面

- markdown-editor (清空、下载)
- hash-generator (清空、生成、复制全部)
- json-formatter (清空、转换)
- url-encode (清空、编码/解码)
- base64 (清空、编码/解码)
- regex-tester (清空，需同时检查 pattern 和 testString)
- interval-parser (清空、导出 TXT、导出 Excel)
- word-counter (清空，已遵循此规则)
