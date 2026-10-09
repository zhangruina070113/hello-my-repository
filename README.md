# 我的博客

一个纯静态的个人博客，无需任何构建工具，直接由 **GitHub Pages** 托管。

在线地址：<https://zhangruina070113.github.io/hello-my-repository/>

## 目录结构

```
.
├── index.html              # 首页（文章列表）
├── about.html              # 关于页面
├── posts/                  # 所有文章
│   ├── hello-world.html
│   └── how-to-add-a-post.html
├── assets/
│   ├── style.css           # 全站样式
│   ├── main.js             # 深色模式 / 年份等交互
│   └── favicon.svg
├── .nojekyll               # 告诉 GitHub Pages 不要用 Jekyll 处理
└── README.md
```

## 写一篇新文章

1. 复制 `posts/hello-world.html`，重命名为 `posts/你的标题.html`；
2. 修改 `<title>`、`<h1>`、日期和正文；
3. 在 `index.html` 的 `post-list` 里复制一张 `<article class="post-card">` 卡片，改成新文章的标题、摘要和链接。

## 本地预览

直接用浏览器打开 `index.html` 即可。或者在项目根目录启动一个本地服务器：

```bash
python -m http.server 8000
```

然后访问 <http://localhost:8000>。

## 发布到 GitHub

```bash
git add .
git commit -m "post: 添加新文章"
git push
```

推送后 GitHub Pages 会自动重新构建并发布。

## 启用 GitHub Pages（首次）

1. 打开仓库页面的 **Settings → Pages**；
2. 在 **Build and deployment** 下，Source 选择 **Deploy from a branch**；
3. Branch 选择 `main`，目录选择 `/ (root)`，点击 **Save**；
4. 等待一两分钟，站点就会发布到 <https://zhangruina070113.github.io/hello-my-repository/>。

## 图片放哪里

在 `assets/` 下新建 `images/` 目录，把图片放进去，然后用相对路径引用：

```html
<img src="../assets/images/example.jpg" alt="说明文字">
```

## License

个人博客内容版权归作者所有。
