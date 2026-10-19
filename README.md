# 我的博客

一个基于 [Astro](https://astro.build) 构建的个人技术博客，用于记录课程学习、数据结构与算法笔记。

站点采用静态生成，文章以 Markdown 管理，构建时自动生成全文搜索索引，并通过 GitHub Actions 持续部署到 GitHub Pages，无需任何服务器。

**🔗 在线访问**：[https://zhangruina070113.github.io/hello-my-repository/](https://zhangruina070113.github.io/hello-my-repository/)

## 技术栈

| 分类 | 方案 |
|------|------|
| 框架 | Astro 5（静态站点生成） |
| 交互组件 | Svelte 5 |
| 样式 | Tailwind CSS 3 + Stylus |
| 内容管理 | Astro Content Collections + Markdown / YAML frontmatter |
| 站内搜索 | Pagefind（构建时生成索引，纯前端检索） |
| 代码高亮 | Expressive Code（行号、语言标签、折叠、一键复制） |
| 数学公式 | KaTeX |
| 部署 | GitHub Actions → GitHub Pages |

## 核心特性

- **零后端架构**：全站静态生成，托管于 GitHub Pages，无服务器成本
- **构建时搜索**：Pagefind 在构建阶段扫描页面并生成索引，运行时无需任何检索服务
- **内容与代码分离**：文章、项目、页面文案统一放在 `src/content/`，新增内容不涉及业务代码
- **完善的代码展示**：语法高亮、行号、语言标签、代码折叠与一键复制
- **数学公式支持**：行内与块级 LaTeX 公式渲染
- **明暗主题**：跟随系统偏好，同时支持访客手动切换
- **订阅与收录**：自动生成 RSS 与 sitemap，便于订阅和搜索引擎索引
- **响应式布局**：适配桌面与移动端阅读

## 实现要点

- 使用 Astro Content Collections 管理文章，frontmatter 由 Zod schema 校验，字段缺失或类型错误会在构建阶段直接报错
- 构建流程分为两步：先用 Astro 生成静态页面，再由 Pagefind 扫描产物生成搜索索引
- 通过 `site` 与 `base` 配置适配 GitHub Pages 项目站的子路径部署，保证静态资源路径正确
- 部署由 GitHub Actions 完成：校验依赖锁文件 → 构建 → 上传产物 → 发布，推送即自动上线

## 项目结构

```
src/
├── config.ts           # 站点信息、导航、侧边栏与主题配置
├── content/
│   ├── posts/          # 文章（Markdown）
│   └── spec/           # 页面文案
├── components/         # 可复用组件
├── layouts/            # 页面布局
├── pages/              # 路由与页面
└── styles/             # 全局样式
public/                 # 静态资源
tools/                  # 内容创作与发布辅助脚本
.github/workflows/      # GitHub Actions 部署流程
astro.config.mjs        # Astro 构建配置
```

## 本地运行

需要 Node.js ≥ 20 与 pnpm 9。

```bash
pnpm install     # 安装依赖
pnpm dev         # 启动开发服务器
pnpm build       # 构建静态站点并生成搜索索引
pnpm preview     # 预览构建产物
```

开发服务器地址：`http://localhost:4321/hello-my-repository/`

## 许可

基于 [fuwari](https://github.com/saicaca/fuwari) 模板构建，遵循 MIT License。
