/**
 * 列出已有文章，选一篇打开编辑
 * 由根目录的「修改已有文章.bat」双击调用（用 CommonJS，因为项目本身是 ESM）
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execFile, spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const postsDir = path.join(root, "src", "content", "posts");

/** 有 VS Code 就用 VS Code，否则用记事本 */
function openEditor(file) {
  if (process.env.BLOG_NO_EDITOR === "1") return;
  const hasCode = spawnSync("where", ["code"], { shell: true, stdio: "ignore" }).status === 0;
  execFile(hasCode ? "code" : "notepad.exe", [file], { shell: hasCode }, () => {});
}

/** 收集所有 Markdown 文章 */
function collect(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collect(full));
    else if (entry.name.toLowerCase().endsWith(".md")) out.push(full);
  }
  return out;
}

/** 从 frontmatter 里取标题和发布日期 */
function readMeta(file) {
  const raw = fs.readFileSync(file, "utf8");
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let title = "";
  let published = "";
  if (block) {
    const t = block[1].match(/^title:\s*(.+)$/m);
    const p = block[1].match(/^published:\s*(.+)$/m);
    if (t) title = t[1].trim();
    if (p) published = p[1].trim();
  }
  return { title: title || path.basename(file), published };
}

(async () => {
  const files = collect(postsDir);
  if (files.length === 0) {
    console.log("");
    console.log("还没有任何文章，先用「新建一篇文章.bat」写一篇吧。");
    process.exit(0);
  }

  // 最近改过的排前面
  files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  console.log("");
  console.log("========== 修改已有文章 ==========");
  console.log("");

  files.forEach((f, i) => {
    const meta = readMeta(f);
    console.log("  [" + (i + 1) + "] " + meta.title + "   （" + meta.published + "）");
  });
  console.log("");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));
  const args = process.argv.slice(2);

  let answer = args[0];
  if (answer === undefined) answer = await ask("输入要修改的文章编号，然后回车: ");
  rl.close();

  const index = parseInt((answer || "").trim(), 10);
  if (isNaN(index) || index < 1 || index > files.length) {
    console.log("");
    console.log("编号不对，已取消。");
    process.exit(1);
  }

  const file = files[index - 1];
  const meta = readMeta(file);

  console.log("");
  console.log("正在打开：" + meta.title);
  console.log("文件位置：" + path.relative(root, file));
  console.log("");
  console.log("改完保存关闭，然后双击「发布到网站.bat」就更新了。");

  openEditor(file);
})();
