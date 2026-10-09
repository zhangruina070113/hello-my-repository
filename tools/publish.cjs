/**
 * 把本地改动提交并推送到 GitHub
 * 由根目录的「发布到网站.bat」双击调用（用 CommonJS，因为项目本身是 ESM）
 */
const { spawnSync } = require("child_process");
const net = require("net");
const path = require("path");

const root = path.resolve(__dirname, "..");

/** 静默执行 git，用于读取信息 */
function git(args) {
  return spawnSync("git", args, { cwd: root, encoding: "utf8" });
}

/** 执行 git 并把输出直接显示到屏幕 */
function gitLive(args) {
  return spawnSync("git", args, { cwd: root, stdio: "inherit" });
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 读取 Git 为 github.com 配置的代理地址 */
function getProxy() {
  const r = git(["config", "--get", "http.https://github.com.proxy"]);
  return ((r.stdout || "").trim()) || "";
}

/** 检查代理端口是否在监听（返回 true / false / null 表示无法判断） */
function checkProxy(proxyUrl) {
  return new Promise((resolve) => {
    let host = "127.0.0.1";
    let port = 0;
    try {
      const u = new URL(proxyUrl);
      host = u.hostname || host;
      port = Number(u.port);
    } catch (e) {
      resolve(null);
      return;
    }
    if (!port) {
      resolve(null);
      return;
    }
    const socket = net.connect({ host, port });
    const finish = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(1500);
    socket.on("connect", () => finish(true));
    socket.on("timeout", () => finish(false));
    socket.on("error", () => finish(false));
  });
}

(async () => {
  console.log("");
  console.log("========== 发布到网站 ==========");
  console.log("");

  // 先看看梯子在不在
  const proxy = getProxy();
  if (proxy) {
    const alive = await checkProxy(proxy);
    if (alive === false) {
      console.log("⚠ 检测到 GitHub 代理没有在运行：" + proxy);
      console.log("  请先把梯子打开，然后再双击一次。");
      console.log("");
      process.exit(1);
    }
  }

  if (gitLive(["add", "-A"]).status !== 0) {
    console.log("");
    console.log("git add 失败，请确认 Git 已正确安装。");
    process.exit(1);
  }

  // 有改动就提交
  const hasStaged = git(["diff", "--cached", "--quiet"]).status !== 0;
  if (hasStaged) {
    console.log("");
    console.log("正在提交改动……");
    if (gitLive(["commit", "-m", "post: 内容更新 " + today()]).status !== 0) {
      console.log("");
      console.log("提交失败，请把上面的错误信息发给 Codex 看看。");
      process.exit(1);
    }
  }

  // 本地是否还有没上传的提交（上次上传失败留下的也算）
  const upstream = ((git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]).stdout) || "").trim();
  let ahead = 0;
  if (upstream) {
    const n = parseInt(((git(["rev-list", "--count", upstream + "..HEAD"]).stdout) || "0").trim(), 10);
    if (!isNaN(n)) ahead = n;
  }

  if (!hasStaged && ahead === 0) {
    console.log("");
    console.log("没有发现新改动，也不需要上传。");
    process.exit(0);
  }

  console.log("");
  console.log("正在上传到 GitHub" + (proxy ? "（走代理 " + proxy + "）" : "") + "……");

  const maxTries = 4;
  for (let i = 1; i <= maxTries; i++) {
    if (gitLive(["push"]).status === 0) {
      console.log("");
      console.log("完成！大约两分钟后刷新网站就能看到新内容。");
      process.exit(0);
    }
    if (i < maxTries) {
      console.log("");
      console.log("第 " + i + " 次上传失败，3 秒后自动重试……");
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  console.log("");
  console.log("上传失败，多半是网络问题。确认梯子在运行，然后再双击一次这个文件。");
  process.exit(1);
})();
