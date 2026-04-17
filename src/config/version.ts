import { APP_VERSION as VERSION } from "@/utils/version";

export const APP_VERSION = VERSION;

export const VERSION_HISTORY = [
  {
    version: "0.3.1",
    date: "2026-04-17",
    changes: [
      "完善版本管理文档",
      "在首页标题添加版本号显示",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-04-17",
    changes: [
      "优化版本管理系统为一站式流程",
      "版本号从 package.json 自动读取，零手动修改",
      "添加 UpdateChecker 组件自动检测版本更新",
      "简化 release.js 发布脚本",
      "更新 Changesets 配置为 public access",
      "完善版本管理工作流文档",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-04-17",
    changes: [
      "添加版本管理系统和项目文档",
      "集成 Changesets 进行版本管理",
      "添加版本发布和回滚脚本",
      "创建 README.md 和 LICENSE 文档",
      "优化滚动条自动隐藏功能",
      "完善设置页面布局",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-04-17",
    changes: [
      "初始版本发布",
      "支持主题切换（浅色/深色/跟随系统）",
      "Markdown 编辑器支持语法高亮、表格、GitHub Alerts",
      "JSON 格式化工具",
      "二维码生成器",
      "设置页面支持持久化存储",
    ],
  },
];
