const padZero = (value) => value.toString().padStart(2, '0');

export function displayTime(clockEl) {
  const now = new Date();
  const hour = padZero(now.getHours());
  const minute = padZero(now.getMinutes());
  const second = padZero(now.getSeconds());
  clockEl.textContent = `${hour}:${minute}:${second}`;
}