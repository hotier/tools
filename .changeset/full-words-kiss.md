---
"tools": minor
---

## 0.6.1 更新总结
### 🔴 删除
- 删除 .changeset/ 目录（changesets 配置）
- 删除 CategoryToolsList.tsx 、 CustomSelect.tsx 组件
- 删除 vercel.json 中的缓存配置
### ➕ 新增
- 新文件 ： src/data/tools.tsx （258行） - 工具数据配置
- 新文件 ： src/components/useTrackToolUsage.ts （17行） - 工具使用追踪
- 新增功能 ： /new 、 /popular 页面大幅更新（100+行改动）
- 二维码生成器 ：详细说明容错级别 L/M/Q/H
- Markdown 编辑器 ：详细说明功能特点
- 字数统计 ：详细说明统计项目
- 颜色选择器 ：新增支持 HEX、RGB、HSL 格式说明
- interval-parser ：优化时间戳范围说明
### ✏️ 修改
文件 改动说明 Header.tsx 搜索框：自定义占位层、斜杠图标、层级优化 Sidebar.tsx 侧边栏样式优化 globals.css 全局样式调整 layout.tsx 布局组件更新 button.tsx 按钮组件优化 utils.ts 工具函数格式调整 多个页面 样式和描述优化

### ⚙️ 其他
- package-lock.json 更新依赖
- AGENTS.md 更新代理规则
- release.yml workflow 优化

01:50
免费

帮我生成更新说明

Builder

思考过程

根据这次更新内容，我帮您生成更新说明：

## v0.6.1 更新说明
### 🆕 新功能
- 工具使用追踪 ：新增 useTrackToolUsage 组件，追踪工具使用情况
- 新版首页/最新/热门页面 ：全新设计的页面布局，展示最近更新和热门工具
### 🔧 优化
- 搜索框体验 ：自定义占位层，支持"请键入 + 斜杠图标 + 搜索"样式
- 工具详情优化 ：更新了以下工具的描述说明：
  - 二维码生成器：新增容错级别详细说明（L/M/Q/H）
  - Markdown 编辑器：完善功能特点列表
  - 字数统计：详细统计项目说明
  - 颜色选择器：新增 HEX/RGB/HSL 格式支持说明
  - 区间解析器：优化时间戳范围说明
### 🗑️ 删除
- 移除 changesets 相关配置（ .changeset/ 目录）
- 移除部分冗余组件
- 简化 vercel.json 缓存配置
### ⚙️ 其他
- Workflow 发布流程优化
- 全局样式和组件优化
- 依赖版本更新
