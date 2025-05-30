import { displayTime } from './clock.js';
import { setupPomodoro, startPomodoro } from './pomodoro.js';
import { setupPip } from './pip.js';
import { state } from './state.js';

window.addEventListener("load", () => {
  const clockEl = document.getElementById("clock");
  const timerBtn = document.getElementById("timerBtn");
  const resetBtn = document.getElementById("resetBtn");
  const pipBtn = document.getElementById("pipBtn");
  const pipContent = document.getElementById("pip");

  // 初期状態
  timerBtn.style.display = "none";
  resetBtn.style.display = "none";
  displayTime(clockEl);
  state.timer = setInterval(() => displayTime(clockEl), 1000);

  // モード切替
  document.getElementById("clockModeBtn").addEventListener("click", () => {
    state.mode = "clock";
    timerBtn.style.display = "none";
    resetBtn.style.display = "none";
    clearInterval(state.timer);

    // ポモドーロ状態をリセットする（重要）
    state.endtime = null;
    state.stoptime = null;
    state.refreshFlag = true;
    state.isRunning = false;
    timerBtn.textContent = "開始";

    displayTime(clockEl);
    state.timer = setInterval(() => displayTime(clockEl), 1000);
});


  document.getElementById("pomodoroModeBtn").addEventListener("click", () => {
    state.mode = "pomodoro";
    timerBtn.style.display = "block";
    resetBtn.style.display = "block";
    clearInterval(state.timer);
    clockEl.textContent = "25:00";
  });

  // タイマーとPiP設定
  setupPomodoro(clockEl, timerBtn, resetBtn);
  pipBtn.addEventListener("click", () => setupPip(pipBtn, pipContent, clockEl));
});
