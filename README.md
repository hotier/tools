# 🔧 个人工具箱

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/hotier/tools)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

一个基于 Next.js 构建的现代化个人工具集合，提供多种实用工具，让工作更高效。

## ✨ 功能特性

### 📝 Markdown 编辑器
- 实时预览
- 语法高亮（支持多种编程语言）
- GitHub Flavored Markdown (GFM) 支持
- GitHub Alerts（Note、Tip、Warning 等）
- 任务列表
- 表格渲染
- 代码块语言标签

### 📋 JSON 格式化工具
- JSON 格式化与压缩
- 语法高亮
- 错误检测
- 一键复制

### 📱 二维码生成器
- 自定义内容生成
- 多种尺寸选择
- 一键下载

### 🎨 主题系统
- 浅色模式
- 深色模式
- 跟随系统
- 平滑过渡动画

### ⚙️ 设置管理
- 持久化存储
- 数据清除
- 使用统计

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn、pnpm 或 bun

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 生产构建

```bash
npm run build
npm run start
```

## 📦 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Markdown**: [markdown-it](https://github.com/markdown-it/markdown-it) + 插件
- **代码高亮**: [highlight.js](https://highlightjs.org/)
- **二维码**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Excel**: [xlsx](https://www.npmjs.com/package/xlsx)
- **版本管理**: [@changesets/cli](https://www.changesets.com/)

## 🔄 版本管理

本项目使用 Changesets 进行版本管理。

### 添加变更记录

开发完成后，记录变更：

```bash
npm run change
```

选择变更类型：
- `patch` - Bug 修复 (0.0.x)
- `minor` - 新功能 (0.x.0)
- `major` - 重大变更 (x.0.0)

### 预览版本变更

```bash
npm run version
```

### 发布新版本

```bash
npm run release
```

自动完成：
- 更新 package.json 版本号
- 更新 CHANGELOG.md
- 创建 Git 标签

### 推送到远程

```bash
git push origin main --tags
```

### 版本回滚

```bash
npm run rollback
```

## 📁 项目结构

```
tools/
├── .changeset/           # Changesets 配置
│   ├── config.json
│   └── README.md
├── public/               # 静态资源
├── scripts/              # 脚本
│   ├── release.js        # 发布脚本
│   └── rollback.js       # 回滚脚本
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 路由
│   │   ├── page.tsx      # 首页
│   │   └── settings/     # 设置页面
│   ├── components/       # React 组件
│   │   └── layout/       # 布局组件
│   ├── config/           # 配置文件
│   │   └── version.ts    # 版本配置
│   └── hooks/            # React Hooks
├── CHANGELOG.md          # 更新日志
├── package.json
└── README.md
```

## 🎯 开发指南

### 代码规范

```bash
npm run lint
```

### 添加新工具

1. 在 `src/app/` 下创建新的路由目录
2. 在 `src/components/` 下创建组件
3. 更新首页工具列表

### 主题适配

使用 CSS 变量确保主题兼容：

```css
/* 浅色模式 */
--background: #f8fafc;
--foreground: #0f172a;

/* 深色模式 */
.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
}
```

## 📄 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📜 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Changesets](https://www.changesets.com/) - 版本管理工具

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
