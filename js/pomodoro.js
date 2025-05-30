import { state } from './state.js';

const padZero = (value) => value.toString().padStart(2, '0');

function updateTimerDisplay(clockEl) {
  const now = new Date().getTime();
  const total = state.endtime - now;

  if (total <= 0) {
    clearInterval(state.timer);
    state.isRunning = false;
    if (state.refreshFlag) {
      clockEl.textContent = "05:00";
      startRefreshTime(clockEl);
    } else {
      clockEl.textContent = "25:00";
      startPomodoro(clockEl);
    }
    return;
  }

  const minutes = Math.floor(total / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);
  clockEl.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
}

export function startPomodoro(clockEl, timerBtn) {
  state.endtime = new Date().getTime() + 1000 * 60 * 25;
  updateTimerDisplay(clockEl);
  state.timer = setInterval(() => updateTimerDisplay(clockEl), 1000);
  state.isRunning = true;
  state.refreshFlag = true;
  timerBtn.textContent = "停止";
}

function startRefreshTime(clockEl) {
  state.endtime = new Date().getTime() + 1000 * 60 * 5;
  updateTimerDisplay(clockEl);
  state.timer = setInterval(() => updateTimerDisplay(clockEl), 1000);
  state.refreshFlag = false;
}

export function setupPomodoro(clockEl, timerBtn, resetBtn) {
  timerBtn.addEventListener("click", () => {
    if (!state.isRunning) {
      if (!state.endtime) {
        state.endtime = new Date().getTime() + (state.refreshFlag ? 25 : 5) * 60 * 1000;
      } else if (state.stoptime) {
        const now = new Date().getTime();
        state.endtime += (now - state.stoptime);
        state.stoptime = null;
      }
      updateTimerDisplay(clockEl);
      state.timer = setInterval(() => updateTimerDisplay(clockEl), 1000);
      state.isRunning = true;
      timerBtn.textContent = "停止";
    } else {
      clearInterval(state.timer);
      state.stoptime = new Date().getTime();
      state.isRunning = false;
      timerBtn.textContent = "開始";
    }
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(state.timer);
    state.endtime = null;
    state.stoptime = null;
    state.refreshFlag = true;
    state.isRunning = false;
    timerBtn.textContent = "開始";
    clockEl.textContent = "25:00";
  });
}