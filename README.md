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
- **版本管理**: [@changesets/cli](https://www.changesets.com/)

## 🔄 版本管理

本项目使用 **Changesets + GitHub Actions + Vercel** 实现自动化版本发布流程，全链路打通：
**开发→变更→release分支→自动版本更新→main分支→Vercel部署**

### 🚀 自动化发布流程（推荐）

通过 GitHub Actions 实现完全自动化的版本管理和部署：

```bash
# 1️⃣ 日常开发（可以在main分支或任意分支）
git checkout main
# ... 编写代码 ...

# 2️⃣ 准备发布：切换到release分支，合并你的代码
git checkout release
git merge main  # 或 cherry-pick 需要发布的commit

# 3️⃣ 记录功能变更
npx changeset
# 选择变更类型，输入功能描述

# 4️⃣ 推送到release分支，触发自动化流程
git add .
git commit -m "你的提交信息"
git push origin release
```

**自动化流程会自动完成：**
- ✅ 合并release分支到main分支（带原始提交信息）
- ✅ 运行 `changeset version` 更新版本号和CHANGELOG
- ✅ 提交并推送到main分支
- ✅ 触发Vercel自动部署（只有main分支会触发）

### ⚙️ 自动化流程配置

- **GitHub Actions Workflow**: `.github/workflows/release.yml`
- **Vercel配置**: `vercel.json` - 只允许main分支部署
- **避免循环部署**: Vercel只监听main分支，workflow推送到release分支不会触发部署

### 📋 传统手动发布 SOP（4 步完成发布）

```bash
# 1️⃣ 开发功能
git checkout -b feature/xxx
# ... 编写代码 ...

# 2️⃣ 记录功能变更
npm run change
# 选择变更类型，输入功能描述

# 3️⃣ 聚合版本（自动升版本号）
npm run version
# 自动更新 package.json 和 CHANGELOG.md

# 4️⃣ 一键发版
npm run release
# 自动提交、打标签、推送到远程
```

### 📦 版本号规则（严格 SemVer）

| 类型 | 说明 | 版本变化 |
|------|------|----------|
| `patch` | Bug 修复、小优化 | 0.0.x |
| `minor` | 新功能、兼容更新 | 0.x.0 |
| `major` | 重大变更、不兼容重构 | x.0.0 |

### 🔍 详细操作步骤

#### 1. 记录功能变更

```bash
npm run change
```

交互步骤：
1. 选择变更类型：`patch | minor | major`
2. 输入功能描述（如：新增首页轮播、修复登录弹窗 bug）
3. 自动生成 `.changeset/xxx.md` 功能变更文件

#### 2. 聚合版本号

```bash
npm run version
```

自动完成：
- ✅ 修改 `package.json` 版本号（零手动）
- ✅ 生成/更新 `CHANGELOG.md`
- ✅ 删除已聚合的 `.changeset` 临时文件

#### 3. 一键发布

```bash
npm run release
```

自动完成：
- ✅ Git 添加所有更改
- ✅ Git 提交 (`chore: release vX.X.X`)
- ✅ 创建 Git 标签 (`vX.X.X`)
- ❓ 询问是否推送到远程

#### 4. 版本回滚

```bash
npm run rollback
```

选择历史版本标签进行回滚。

### 🎯 版本管理优势

- **版本号管理**：全自动，永不手动改，严格 SemVer，全局唯一
- **功能更新管理**：每个功能绑定变更，可归集、可追溯、可合并
- **版本管控**：Git Tag + Changesets 双保险，发布/回滚一键搞定
- **客户端更新**：版本号联动，自动提示新功能，解决缓存问题
- **全闭环**：从开发→功能记录→版本→发布→更新→回滚，一个体系、一套工具

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
│   │   ├── layout/       # 布局组件
│   │   └── UpdateChecker.tsx  # 版本更新检测
│   ├── config/           # 配置文件
│   │   └── version.ts    # 版本历史
│   ├── utils/            # 工具函数
│   │   └── version.ts    # 版本号读取
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
