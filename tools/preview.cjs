/**
 * 启动本地预览服务并打开浏览器，用于发布前检查排版
 * 由根目录的「预览网站.bat」双击调用（用 CommonJS，因为项目本身是 ESM）
 */
const net = require("net");
const http = require("http");
const path = require("path");
const { spawn, execFile } = require("child_process");

const root = path.resolve(__dirname, "..");
const PORT = 4321;
const URL = "http://127.0.0.1:4321/hello-my-repository/";

/** 端口是否已经在监听 */
function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    const finish = (ok) => { socket.destroy(); resolve(ok); };
    socket.setTimeout(1000);
    socket.on("connect", () => finish(true));
    socket.on("timeout", () => finish(false));
    socket.on("error", () => finish(false));
  });
}

/** 等网页真正能访问为止 */
function waitReady(timeoutMs) {
  const started = Date.now();
  return new Promise((resolve) => {
    const tick = () => {
      const req = http.get(URL, (res) => { res.resume(); resolve(true); });
      req.on("error", () => {
        if (Date.now() - started > timeoutMs) resolve(false);
        else setTimeout(tick, 1500);
      });
    };
    tick();
  });
}

function openBrowser(url) {
  // 测试时可以设 BLOG_NO_BROWSER=1 跳过打开浏览器
  if (process.env.BLOG_NO_BROWSER === "1") {
    console.log("（已跳过自动打开浏览器）");
    return;
  }
  execFile("cmd", ["/c", "start", "", url], () => {});
}

(async () => {
  console.log("");
  console.log("========== 预览网站 ==========");
  console.log("");

  if (await isPortOpen(PORT)) {
    console.log("预览服务已经在运行了。");
  } else {
    console.log("正在启动本地预览服务，第一次大概要等 30～60 秒……");
    const child = spawn("cmd", ["/c", "pnpm", "dev", "--host", "127.0.0.1"], {
      cwd: root,
      detached: true,
      stdio: "ignore",
    });
    child.unref();

    const ok = await waitReady(150000);
    if (!ok) {
      console.log("");
      console.log("启动超时了。请再双击一次，或者把窗口里的信息发给 Codex 看看。");
      process.exit(1);
    }
    console.log("预览服务已就绪。");
  }

  console.log("");
  console.log("正在打开浏览器：" + URL);
  openBrowser(URL);
  console.log("");
  console.log("浏览器里显示的就是发布后的真实效果。");
  console.log("确认排版没问题后，双击「发布到网站.bat」上传。");
})();
