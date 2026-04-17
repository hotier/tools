# 版本变更记录

## 0.6.1

### Patch Changes

- [`706eed0`](https://github.com/hotier/tools/commit/706eed0f968b03f13275294089d23338bd2c3a05) Thanks [@hotier](https://github.com/hotier)! - 更新版本号和 changelog

## 0.6.0

### Minor Changes

- [`6bf1699`](https://github.com/hotier/tools/commit/6bf169946267b5a87e5b1540ac948afbf4decc97) Thanks [@hotier](https://github.com/hotier)! - feat: 更新工具页面样式和组件优化

### Patch Changes

- [`e7d5de8`](https://github.com/hotier/tools/commit/e7d5de87462f1e90cbf3e3a7038af7bfb07759f4) Thanks [@hotier](https://github.com/hotier)! - feat: 更新工具页面样式和组件优化

## 0.4.0

### Minor Changes

- 新增 UUID 生成器、Hash 生成器、字数统计工具

  **新功能**

  - 新增 UUID 生成器：批量生成 UUID，支持大写和无连字符格式
  - 新增 Hash 生成器：支持 MD5、SHA-1、SHA-256、SHA-384、SHA-512 算法
  - 新增字数统计：实时统计字符数、单词数、行数等

  **优化**

  - Markdown 编辑器：下载前检查空内容，文件名改为时间戳格式
  - 区间解析：导出文件名改为时间戳格式
  - Toast 组件：移除边框，错误提示颜色调淡
  - 添加页面加载动画，优化用户体验
  - 区间解析页面动态导入 xlsx 库，减少首屏加载时间

## 0.3.1

### Patch Changes

- - 优化版本管理系统为一站式流程
  - 版本号从 package.json 自动读取，零手动修改
  - 添加 UpdateChecker 组件自动检测版本更新
  - 简化 release.js 发布脚本
  - 更新 Changesets 配置为 public access
  - 完善版本管理工作流文档

## 0.3.0

### Minor Changes

- 优化版本管理系统为一站式流程
  - 版本号从 package.json 自动读取，零手动修改
  - 添加 UpdateChecker 组件自动检测版本更新
  - 简化 release.js 发布脚本
  - 更新 Changesets 配置为 public access
  - 完善版本管理工作流文档

## 0.2.0

### Minor Changes

- 添加版本管理系统和项目文档
  - 集成 Changesets 进行版本管理
  - 添加版本发布和回滚脚本
  - 创建 README.md 和 LICENSE 文档
  - 优化滚动条自动隐藏功能
  - 完善设置页面布局

所有重要的变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

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
