# 🔧 个人工具箱

[![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)](https://github.com/hotier/tools)
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
- **版本管理**: [Semantic Release](https://semantic-release.gitbook.io/semantic-release/)

## 🔄 版本管理

本项目使用 **Semantic Release + GitHub Actions + Vercel** 实现自动化版本发布流程：
**开发→commit→release分支→CI构建→自动版本更新→GitHub Release→合并main→Vercel部署**

### 📋 Commit 规范

项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

| 类型 | 说明 | 版本变化 |
|------|------|----------|
| `feat` | 新功能 | minor |
| `fix` | Bug 修复 | patch |
| `docs` | 文档变更 | - |
| `style` | 代码格式（不影响功能） | - |
| `refactor` | 重构（不是修复也不是新功能） | - |
| `perf` | 性能优化 | - |
| `test` | 测试相关 | - |
| `build` | 构建系统或依赖变更 | - |
| `ci` | CI 配置变更 | - |
| `chore` | 其他变更 | - |
| `BREAKING CHANGE` | 破坏性变更 | major |

### 📦 版本号规则（严格 SemVer）

| 类型 | 说明 | 版本变化 |
|------|------|----------|
| `patch` | Bug 修复、小优化 | 0.0.x |
| `minor` | 新功能、兼容更新 | 0.x.0 |
| `major` | 重大变更、不兼容重构 | x.0.0 |

### 🚀 发布流程

#### 1. 开发并提交

```bash
# ... 在 main 分支编写代码 ...

git add .
git commit -m "feat: 新增某某功能"
git push origin main
```

#### 2. 准备发布

```bash
# 切换到 release 分支并合并 main
git checkout release
git merge main
git push origin release
```

#### 3. CI 自动完成

推送到 release 分支后，GitHub Actions 自动完成：
- ✅ 安装依赖
- ✅ 构建项目
- ✅ 分析 commit 历史确定版本号
- ✅ 生成 CHANGELOG.md
- ✅ 创建 GitHub Release
- ✅ 更新 package.json 版本
- ✅ 创建 Git 标签
- ✅ 提交所有更改
- ✅ 合并 release 到 main 分支

#### 4. Vercel 自动部署

Vercel 检测到 main 分支更新，自动部署到生产环境。

### ⚙️ 配置文件

- **Semantic Release**: `.releaserc`
- **GitHub Actions**: `.github/workflows/release.yml`
- **Vercel**: `vercel.json` - 只允许 main 分支部署

### 🔍 手动操作

#### 版本回滚

```bash
npm run rollback
```

选择历史版本标签进行回滚。

### 🎯 版本管理优势

- **自动化**：完全自动化的版本发布流程
- **版本号管理**：全自动，基于 commit 历史分析，严格 SemVer
- **CHANGELOG 生成**：自动根据 commit 信息生成
- **GitHub Release**：自动创建，包含完整的 Release Notes
- **版本管控**：Git Tag + Semantic Release 双保险

## 📁 项目结构

```
tools/
├── .releaserc              # Semantic Release 配置
├── public/                  # 静态资源
├── scripts/                 # 脚本
│   └── rollback.js          # 回滚脚本
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── page.tsx        # 首页
│   │   └── settings/       # 设置页面
│   ├── components/         # React 组件
│   │   ├── layout/         # 布局组件
│   │   └── UpdateChecker.tsx  # 版本更新检测
│   ├── config/             # 配置文件
│   │   └── version.ts      # 版本历史
│   ├── utils/              # 工具函数
│   │   └── version.ts      # 版本号读取
│   └── hooks/              # React Hooks
├── CHANGELOG.md            # 更新日志
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
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📜 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) - 版本管理工具

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
