# 我的博客

个人技术博客 —— 记录课程学习、数据结构与算法笔记，以及日常的技术折腾。

基于 [Astro](https://astro.build) + [fuwari](https://github.com/saicaca/fuwari) 模板搭建，纯静态生成，已上线运行。

## 在线访问

🔗 [https://zhangruina070113.github.io/hello-my-repository/](https://zhangruina070113.github.io/hello-my-repository/)

## 站点特色

- **内容与代码分离**：文章全部用 Markdown 编写（`src/content/posts/`），写内容不需要碰代码
- **无后端架构**：GitHub Pages 托管 + GitHub Actions 部署，零服务器成本
- **双击式写作流程**：新建、修改、预览、发布各有独立脚本，不用记命令
- **发布前可预览**：本地启动真实站点，排版问题在发布前就能发现
- **亮暗双模式**：跟随系统自动切换，访客也可以手动切换
- **离线搜索**：Pagefind 在构建时生成索引，站内搜索无需后端
- **代码体验**：代码高亮 + 行号 + 语言标签 + 一键复制、阅读进度条、目录跟随
- **数学公式**：KaTeX 渲染，支持行内与独立公式
- **RSS 与站点地图**：自动生成，方便订阅与搜索引擎收录

## 技术栈

| 项 | 方案 |
|----|------|
| 框架 | Astro 5（静态生成） |
| 交互组件 | Svelte 5 |
| 样式 | Tailwind CSS 3 + Stylus |
| 站内搜索 | Pagefind（构建时生成离线索引） |
| 代码高亮 | Expressive Code（行号 / 折叠 / 语言标签 / 复制） |
| 数学公式 | KaTeX |
| 部署 | GitHub Actions → GitHub Pages |
| 内容格式 | Markdown + YAML frontmatter |

## 写一篇文章

### 方式一：双击脚本（推荐）

仓库根目录的四个脚本：

| 脚本 | 作用 |
|------|------|
| `新建一篇文章.bat` | 输入标题和文件名，生成 Markdown 文件并打开编辑器 |
| `修改已有文章.bat` | 列出全部文章，按编号打开修改 |
| `预览网站.bat` | 启动本地服务并打开浏览器，发布前检查排版 |
| `发布到网站.bat` | 提交并推送到 GitHub，网络异常时自动切换方式重试 |

推送后大约两分钟，线上网站自动更新。

> 文章网址来自文件名：`hello-blog` → `/posts/hello-blog/`。
> 标题写中文没问题，文件名建议用英文或拼音。

### 方式二：手动创建

在 `src/content/posts/` 下新建 Markdown 文件，比如 `my-post.md`：

```markdown
---
title: 文章标题
published: 2026-10-19
description: 一句话摘要
tags: [随笔]
category: 随笔
---

正文内容……
```

## 开发命令

```bash
pnpm install    # 安装依赖（首次）
pnpm dev        # 本地开发：http://localhost:4321/hello-my-repository/
pnpm build      # 构建到 dist/
pnpm preview    # 预览构建产物
pnpm new-post   # 按命令行参数生成文章模板
```

> 需要 Node ≥ 20 和 pnpm 9。

## 目录结构

```
src/
├── config.ts           # 站点配置：标题、导航、侧边栏、主题色（最常改这里）
├── content/
│   ├── posts/          # 文章（Markdown，日常写作只管这个目录）
│   └── spec/           # 关于页等页面文案
├── components/         # 页面组件
├── layouts/            # 布局
├── pages/              # 路由
└── styles/             # 样式
public/                 # 图片等静态资源
docs/                   # 项目文档
tools/                  # 写作与发布脚本
.github/workflows/      # 自动部署流程
astro.config.mjs        # Astro 配置（site / base 路径写在这里）
```

**编辑分工**：`src/content/posts/` 归日常写作直接编辑；`src/config.ts` 用于调整站点信息；其余代码按需维护。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages。

站点地址相关配置在 `astro.config.mjs`：

```js
site: "https://zhangruina070113.github.io",
base: "/hello-my-repository/",
```

如果以后仓库改名，这两处要同步修改。

## 相关文档

- [博客搭建问题记录](docs/博客搭建问题记录.md) —— 搭建过程中遇到的环境、网络、编码等问题与解决办法

## 备份

最初那一版纯静态站点保存在 `static-backup` 分支。

## 许可

基于 [fuwari](https://github.com/saicaca/fuwari)（MIT License）搭建。
