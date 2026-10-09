# 我的博客

基于 [Astro](https://astro.build) + [fuwari](https://github.com/saicaca/fuwari) 模板搭建的个人博客，纯静态生成，托管在 GitHub Pages 上。

🔗 在线访问：<https://zhangruina070113.github.io/hello-my-repository/>

## 技术栈

| 项 | 方案 |
|----|------|
| 框架 | Astro 5（静态生成） |
| 交互组件 | Svelte 5 |
| 样式 | Tailwind CSS 3 |
| 站内搜索 | Pagefind（构建时生成离线索引） |
| 代码高亮 | Expressive Code（行号 / 折叠 / 复制） |
| 数学公式 | KaTeX |
| 部署 | GitHub Actions → GitHub Pages |

## 写一篇新文章

在 `src/content/posts/` 下新建 Markdown 文件，比如 `my-post.md`：

```markdown
---
title: 文章标题
published: 2026-10-09
description: 一句话摘要
tags: [随笔]
category: 随笔
---

正文内容……
```

保存后提交推送，GitHub Actions 会自动构建并发布。

也可以用命令生成文章模板：

```bash
pnpm new-post my-post
```

## 本地开发

```bash
pnpm install    # 安装依赖（首次）
pnpm dev        # 本地开发：http://localhost:4321/hello-my-repository/
pnpm build      # 构建到 dist/
pnpm preview    # 预览构建产物
```

> 需要 Node ≥ 20 和 pnpm 9。

## 目录结构

```
src/
├── config.ts           # 站点配置：标题、导航、侧边栏、主题色（最常改这里）
├── content/
│   ├── posts/          # 文章（Markdown，平时只管写这个目录）
│   └── spec/           # 关于页等页面文案
├── components/         # 页面组件
├── layouts/            # 布局
├── pages/              # 路由
└── styles/             # 样式
public/                 # 图片等静态资源
.github/workflows/      # 自动部署流程
astro.config.mjs        # Astro 配置（site / base 路径写在这里）
```

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。

与站点地址相关的两处配置在 `astro.config.mjs`：

```js
site: "https://zhangruina070113.github.io",
base: "/hello-my-repository/",
```

如果以后仓库改名，这两处要同步修改。

## 备份

最初那一版纯静态站点保存在 `static-backup` 分支。

## 许可

基于 [fuwari](https://github.com/saicaca/fuwari)（MIT License）搭建。
