import { ToolCategory } from "@/components/SidebarContext";

const tools: ToolCategory[] = [
  {
    category: "开发者工具",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    items: [
      { href: "/dev-tools/json-formatter", label: "JSON 格式化", description: "# 工具简介\n在线JSON格式化、美化、压缩、校验工具，支持自定义缩进" },
      { href: "/dev-tools/base64", label: "Base64 编解码", description: "# 工具简介\nBase64编码与解码工具，支持中文和特殊字符" },
      { href: "/dev-tools/url-encode", label: "URL 编解码", description: "# 工具简介\nURL编码与解码工具，处理特殊字符和中文参数" },
      { href: "/dev-tools/regex-tester", label: "正则测试", description: "# 工具简介\n正则表达式在线测试工具，实时匹配高亮显示。\n\n# 常用标志说明\ng - 全局匹配\ni - 忽略大小写\nm - 多行模式\ns - .匹配换行" },
      { href: "/dev-tools/uuid-generator", label: "UUID 生成器", description: "# 工具简介\n批量生成 UUID/GUID，支持大写和无连字符格式。\n\n# UUID 说明\nUUID（通用唯一识别码）是 128 位的标识符，通常用于分布式系统中的唯一标识。" },
      { href: "/dev-tools/hash-generator", label: "Hash 生成器", description: "# 工具简介\n计算文本的哈希值，支持 MD5、SHA-1、SHA-256、SHA-384、SHA-512 算法。\n\n# 算法说明\nMD5: 128位，已不推荐用于安全场景\nSHA-1: 160位，已不推荐用于安全场景\nSHA-256/384/512: 属于 SHA-2 系列，安全性较高" },
    ],
  },
  {
    category: "常用转换",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    items: [
      { href: "/converters/timestamp", label: "时间戳转换", description: "# 工具简介\n时间戳与日期时间格式互相转换，支持毫秒和秒级时间戳。\n\n# 时间戳说明\n秒级时间戳为10位数字，毫秒时间戳为13位数字，Unix时间戳从1970-01-01 00:00:00 UTC开始。\n\n# 常用编程语言获取时间戳\nJavaScript: Date.now() / 1000\nPython: time.time()\nPHP: time()\nJava: System.currentTimeMillis() / 1000" },
      { href: "/converters/interval-parser", label: "区间解析", description: "# 工具简介\n识别数学区间表达式的上下限，支持自定义开区间边界精度。\n\n# 使用说明\n支持格式：1%<x<=5%、1<n<10、x>=100、m<=50 等（变量名支持任意字母）\n符号支持：<、>、≤、≥、<=、>=，输入支持全角符号，输出统一为半角格式\n\n# 功能特点\n- 每行输入一个区间表达式，支持批量解析\n- 开区间（< 或 >）的边界值会根据精度自动调整\n- 闭区间（<= 或 >=）的边界值保持不变\n- 单向区间（如 x≥50）可设置自定义下限/上限值\n- 自定义值可输入小数或百分比格式，系统自动解析数值进行验证\n- 自定义值需符合区间逻辑（如 x>50 时上限必须大于50）\n- 支持导入 TXT/Excel 文件，导出为 TXT/Excel 格式" },
      { href: "/converters/unit-converter", label: "单位换算", description: "# 工具简介\n长度、重量、温度等单位换算工具，支持多种常用单位" },
      { href: "/converters/color-picker", label: "颜色选择器", description: "# 工具简介\n颜色选择与格式转换工具，支持HEX、RGB、HSL格式互转" },
    ],
  },
  {
    category: "图像处理",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    items: [
      { href: "/image-tools/qrcode", label: "二维码生成", description: "# 工具简介\n在线二维码生成工具，支持自定义尺寸和容错级别。\n\n# 容错级别说明\nL: 7% | M: 15% | Q: 25% | H: 30% 可恢复" },
    ],
  },
  {
    category: "文本编辑",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    items: [
      { href: "/text-tools/markdown-editor", label: "Markdown 编辑器", description: "# 工具简介\n在线Markdown编辑器，支持实时预览和GFM语法。\n\n# 功能特点\n- 实时预览：编辑时同步渲染预览效果\n- GFM支持：表格、任务列表、删除线等\n- 代码高亮：支持多种编程语言语法高亮\n- GitHub Alerts：支持 NOTE、TIP、IMPORTANT、WARNING、CAUTION 提示框\n- 滚动同步：编辑区与预览区滚动联动\n- 导出下载：支持导出为 .md 文件" },
      { href: "/text-tools/word-counter", label: "字数统计", description: "# 工具简介\n文本字数统计工具，实时计算字符数、单词数、行数等。\n\n# 统计项目\n- 字符数（含/不含空格）\n- 中文字数、英文字母、数字字符、标点符号\n- 行数、非空行数、单词数、段落数" },
    ],
  },
];

export default tools;