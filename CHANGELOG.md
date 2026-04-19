# 版本变更记录

## [0.7.1] - 2026-04-19

### Patch Changes

- [`9365e8e`](https://github.com/hotier/tools/commit/9365e8e718f9a1f3aace11eadebdb82b189cc9d6) Thanks [@hotier](https://github.com/hotier)

### 优化
- 搜索框体验 ：自定义占位层，支持"请键入 + 斜杠图标 + 搜索"样式
- 工具详情优化 ：更新了以下工具的描述说明：
  - 二维码生成器：新增容错级别详细说明（L/M/Q/H）
  - Markdown 编辑器：完善功能特点列表
  - 字数统计：详细统计项目说明
  - 颜色选择器：新增 HEX/RGB/HSL 格式支持说明
  - 区间解析器：优化时间戳范围说明

### 删除
- 移除 changesets 相关配置（ .changeset/ 目录）
- 移除部分冗余组件
- 简化 vercel.json 缓存配置

### 其他
- Workflow 发布流程优化
- 全局样式和组件优化
- 依赖版本更新

## [0.7.0] - 2026-04-18

### Minor Changes

- [`975c040`](https://github.com/hotier/tools/commit/975c040d24baa0dd16ca48f51cdf14bbce689287) Thanks [@hotier](https://github.com/hotier)

### 删除
- 删除 .changeset/ 目录（changesets 配置）
- 删除 CategoryToolsList.tsx 、 CustomSelect.tsx 组件
- 删除 vercel.json 中的缓存配置

### 新增
- 新文件 ： src/data/tools.tsx （258 行） - 工具数据配置
- 新文件 ： src/components/useTrackToolUsage.ts （17 行） - 工具使用追踪
- 新增功能 ： /new 、 /popular 页面大幅更新（100+行改动）
- 二维码生成器 ：详细说明容错级别 L/M/Q/H
- Markdown 编辑器 ：详细说明功能特点
- 字数统计 ：详细说明统计项目
- 颜色选择器 ：新增支持 HEX、RGB、HSL 格式说明
- interval-parser ：优化时间戳范围说明

### 修改
- Header.tsx 搜索框：自定义占位层、斜杠图标、层级优化
- Sidebar.tsx 侧边栏样式优化
- globals.css 全局样式调整
- layout.tsx 布局组件更新
- button.tsx 按钮组件优化
- utils.ts 工具函数格式调整
- 多个页面 样式和描述优化

### 其他
- package-lock.json 更新依赖
- AGENTS.md 更新代理规则
- release.yml workflow 优化

### Patch Changes

- [`3e92818`](https://github.com/hotier/tools/commit/3e928187b74f31fe784682ba78e41126fafd525c) Thanks [@hotier](https://github.com/hotier)! - 更新版本号和 changelog

- [`7eece69`](https://github.com/hotier/tools/commit/7eece69d439f74f9e99eb56c944328e504ac25c5) Thanks [@hotier](https://github.com/hotier)! - Merge main into release

## [0.6.1] - 2026-04-16

### Patch Changes

### 其他
- 更新版本号和 changelog

## [0.6.0] - 2026-04-15

### Minor Changes

### 其他
- 更新工具页面样式和组件优化

## [0.5.0] - 2026-04-14

### Patch Changes

### 其他
- 更新工具页面样式和组件优化

## [0.4.0] - 2026-04-14

### Minor Changes

### 新增
- 新增 UUID 生成器、Hash 生成器、字数统计工具
- 新增 UUID 生成器：批量生成 UUID，支持大写和无连字符格式
- 新增 Hash 生成器：支持 MD5、SHA-1、SHA-256、SHA-384、SHA-512 算法
- 新增字数统计：实时统计字符数、单词数、行数等

### 优化
- Markdown 编辑器：下载前检查空内容，文件名改为时间戳格式
- 区间解析：导出文件名改为时间戳格式
- Toast 组件：移除边框，错误提示颜色调淡
- 添加页面加载动画，优化用户体验
- 区间解析页面动态导入 xlsx 库，减少首屏加载时间

## [0.3.1] - 2026-04-13

### Patch Changes

- 优化版本管理系统为一站式流程

### 优化
- 版本号从 package.json 自动读取，零手动修改
- 添加 UpdateChecker 组件自动检测版本更新
- 简化 release.js 发布脚本
- 更新 Changesets 配置为 public access
- 完善版本管理工作流文档

## [0.3.0] - 2026-04-12

### Minor Changes

- 优化版本管理系统为一站式流程

### 优化
- 版本号从 package.json 自动读取，零手动修改
- 添加 UpdateChecker 组件自动检测版本更新
- 简化 release.js 发布脚本
- 更新 Changesets 配置为 public access
- 完善版本管理工作流文档

## [0.2.0] - 2026-04-11

### Minor Changes

- 添加版本管理系统和项目文档

### 新增
- 集成 Changesets 进行版本管理
- 添加版本发布和回滚脚本
- 创建 README.md 和 LICENSE 文档

### 优化
- 优化滚动条自动隐藏功能
- 完善设置页面布局


## [0.1.0] - 2026-04-17

### 新增
- 支持主题切换（浅色/深色/跟随系统）
- Markdown 编辑器支持语法高亮、表格、GitHub Alerts
- JSON 格式化工具
- 二维码生成器
- 设置页面支持持久化存储
- 滚动条自动隐藏功能
- 版本号管理系统

### 优化
- 设置页面布局优化
- 主题切换动画优化

所有重要的变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]