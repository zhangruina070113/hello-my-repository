(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (media.matches ? "dark" : "light");
  }

  function renderToggle() {
    if (!toggle) return;
    var isDark = currentTheme() === "dark";
    toggle.textContent = isDark ? "☀️" : "🌙";
    toggle.setAttribute("aria-label", isDark ? "切换到浅色主题" : "切换到深色主题");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      renderToggle();
    });
  }

  // 用户没有手动选择过时，跟随系统主题变化
  media.addEventListener("change", function () {
    try { if (localStorage.getItem("theme")) return; } catch (e) {}
    root.dataset.theme = media.matches ? "dark" : "light";
    renderToggle();
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  renderToggle();
})();
