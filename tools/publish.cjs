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

/** 执行 git 并把输出直接显示到屏幕（extra 放在子命令之前，用来临时覆盖配置） */
function gitLive(args, extra) {
  return spawnSync("git", (extra || []).concat(args), { cwd: root, stdio: "inherit" });
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

  // 当前 Git 为 github.com 配置的代理（没配置时用默认端口）
  const configuredProxy = getProxy();
  const proxy = configuredProxy || "http://127.0.0.1:7892";
  if (configuredProxy) {
    const alive = await checkProxy(configuredProxy);
    if (alive === false) {
      console.log("⚠ GitHub 代理没在运行（" + configuredProxy + "），本次会直接连接。");
      console.log("");
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

  // 上传：先按当前配置试，不行就换另一种网络方式，尽量自动跑通
  const direct = ["-c", "http.https://github.com.proxy=", "-c", "http.proxy=", "-c", "https.proxy="];
  const viaProxy = ["-c", "http.https://github.com.proxy=" + proxy, "-c", "http.proxy=" + proxy, "-c", "https.proxy=" + proxy];

  const plans = [
    { label: "按当前配置", extra: [] },
    { label: "直连", extra: direct },
    { label: "走代理 " + proxy, extra: viaProxy },
  ];

  for (let p = 0; p < plans.length; p++) {
    const plan = plans[p];
    const tries = 2;
    for (let i = 1; i <= tries; i++) {
      console.log("");
      console.log("正在上传到 GitHub（" + plan.label + "）……");
      if (gitLive(["push"], plan.extra).status === 0) {
        console.log("");
        console.log("完成！大约两分钟后刷新网站就能看到新内容。");
        process.exit(0);
      }
      if (i < tries) {
        console.log("");
        console.log("上传失败，3 秒后重试……");
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
    if (p < plans.length - 1) {
      console.log("");
      console.log("这种方式不通，换下一种试试……");
    }
  }

  console.log("");
  console.log("上传失败：代理和直连都没成功。");
  console.log("请检查网络后，再双击一次这个文件。");
  process.exit(1);
})();
