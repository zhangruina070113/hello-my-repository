/**
 * 把本地改动提交并推送到 GitHub
 * 由根目录的「发布到网站.bat」双击调用（用 CommonJS，因为项目本身是 ESM）
 */
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

function git(args) {
  return spawnSync("git", args, { cwd: root, stdio: "inherit" });
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

console.log("");
console.log("========== 发布到网站 ==========");
console.log("");

if (git(["add", "-A"]).status !== 0) {
  console.log("");
  console.log("git add 失败，请确认 Git 已正确安装。");
  process.exit(1);
}

// 没有改动就直接结束
if (git(["diff", "--cached", "--quiet"]).status === 0) {
  console.log("");
  console.log("没有发现新改动，不需要发布。");
  process.exit(0);
}

console.log("");
console.log("正在提交改动……");
if (git(["commit", "-m", "post: 内容更新 " + today()]).status !== 0) {
  console.log("");
  console.log("提交失败，请把上面的错误信息发给 Codex 看看。");
  process.exit(1);
}

console.log("");
console.log("正在上传到 GitHub（记得把梯子开着）……");
if (git(["push"]).status !== 0) {
  console.log("");
  console.log("上传失败，多半是网络问题：确认梯子在运行，然后再双击一次这个文件。");
  process.exit(1);
}

console.log("");
console.log("完成！大约两分钟后刷新网站就能看到新内容。");
