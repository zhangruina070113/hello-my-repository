/**
 * 交互式新建一篇文章
 * 由根目录的「新建一篇文章.bat」双击调用（用 CommonJS，因为项目本身是 ESM）
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execFile, spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const postsDir = path.join(root, "src", "content", "posts");

function makeAsker() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return {
    ask: (q) => new Promise((resolve) => rl.question(q, (a) => resolve(a.trim()))),
    close: () => rl.close(),
  };
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 有 VS Code 就用 VS Code，否则用记事本 */
function openEditor(file) {
  // 测试时可以设 BLOG_NO_EDITOR=1 跳过自动打开
  if (process.env.BLOG_NO_EDITOR === "1") return;
  const hasCode = spawnSync("where", ["code"], { shell: true, stdio: "ignore" }).status === 0;
  execFile(hasCode ? "code" : "notepad.exe", [file], { shell: hasCode }, () => {});
}

(async () => {
  console.log("");
  console.log("========== 新建一篇文章 ==========");
  console.log("");

  const asker = makeAsker();
  const args = process.argv.slice(2);

  // 也支持直接传参：node tools/new-post.cjs "文章标题" 文件名
  let title = args[0];
  if (title === undefined) title = await asker.ask("1) 文章标题（写中文没问题）: ");
  title = (title || "").trim();
  if (!title) {
    asker.close();
    console.log("标题不能为空，已取消。");
    process.exit(1);
  }

  let slug = args[1];
  if (slug === undefined) slug = await asker.ask("2) 文件名（用英文或拼音，它会变成网址的一部分）: ");
  slug = (slug || "").trim();
  if (!slug) {
    asker.close();
    console.log("文件名不能为空，已取消。");
    process.exit(1);
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
    asker.close();
    console.log("文件名只能用英文字母、数字、点、下划线、短横线，且不能以符号开头。");
    process.exit(1);
  }
  asker.close();

  const file = path.join(postsDir, slug + ".md");
  if (fs.existsSync(file)) {
    console.log("");
    console.log("这个文件已经存在了：" + path.relative(root, file));
    console.log("换个文件名再试。");
    process.exit(1);
  }

  const template = [
    "---",
    "title: " + title,
    "published: " + today(),
    "tags: []",
    "category: ''",
    "draft: false",
    "---",
    "",
    "<!--",
    "  写作提示（看懂后把这段删掉，它不会显示在网页上）：",
    "",
    "  1. 段落之间要空一行，否则所有文字会被拼成一整段",
    "  2. 写代码用三个反引号包起来，缩进和换行才会保留、还有语法高亮",
    "  3. 小标题：行首写两个井号再空一格，例如  ## 小标题",
    "  4. 列表：行首写减号再空一格，例如  - 第一项",
    "  5. 写完先双击「预览网站.bat」看效果，确认没问题再发布",
    "-->",
    "",
    "第一段正文写在这里。",
    "",
    "第二段正文写在这里（注意上面两段之间有一个空行）。",
    "",
    "## 小标题",
    "",
    "这里是小标题下面的内容。",
    "",
  ].join("\n");

  fs.writeFileSync(file, template, "utf8");

  console.log("");
  console.log("已经创建：" + path.relative(root, file));
  console.log("正在打开编辑器，写完保存关闭即可。");
  console.log("");
  console.log("写完之后，双击「发布到网站.bat」就能上传。");

  openEditor(file);
})();
