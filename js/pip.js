export async function setupPip(pipBtn, pipContent, clockEl) {
  if (!("documentPictureInPicture" in window)) {
    alert("PiP未対応ブラウザです。");
    return;
  }

  const pipWindow = await window.documentPictureInPicture.requestWindow({
    width: pipContent.clientWidth,
    height: pipContent.clientHeight,
  });

  // 背景色を反映
  const bg = window.getComputedStyle(pipContent).backgroundColor;
  pipWindow.document.body.style.backgroundColor = bg;

  // スタイル適用
  [...document.styleSheets].forEach(styleSheet => {
    try {
      const rules = [...styleSheet.cssRules].map(rule => rule.cssText).join('');
      const style = document.createElement('style');
      style.textContent = rules;
      pipWindow.document.head.appendChild(style);
    } catch {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleSheet.href;
      pipWindow.document.head.appendChild(link);
    }
  });

  pipBtn.style.display = "none";
  clockEl.classList.add("pipClock");

  pipWindow.document.body.append(pipContent);

  pipWindow.addEventListener("unload", () => {
    document.querySelector("#container").append(pipContent);
    pipBtn.style.display = "block";
    clockEl.classList.remove("pipClock");
  });
}
