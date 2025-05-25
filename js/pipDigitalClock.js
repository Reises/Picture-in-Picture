const pipBtn = document.getElementById('pipBtn');
const clock = document.querySelector("#clock");  //  displayTime関数内でclock要素を取得すると、関数内でしかclock要素を取得していないため、ピクチャーインピクチャーで表示したとき動かない
const timerBtn = document.getElementById('timerBtn');   //  ポモドーロタイマー開始/停止ボタン
const resetBtn = document.getElementById("resetBtn");   //  ポモドーロタイマーリセットボタン
const padZero = value => value.toString().padStart(2, '0');
let mode = "clock"
let timer;
let isRunning = false;  //  タイマーが動いているかどうか判定
let endtime;    //  25ふん後のタイマー終了時刻
let stoptime;   //  停止押下時の時間を保持
let refreshFlag = true;    //  休憩時間管理フラグ

//  デジタル時計の処理
function displayTime() {
    //  00:00:00表記 
    const now = new Date();
    const hour = padZero(now.getHours());
    const minute = padZero(now.getMinutes());
    const second = padZero(now.getSeconds());

    //  現在時刻を文字列にして、ブラウザに表示
    clock.textContent = `${hour}:${minute}:${second}`;
}

//  ポモドーロタイマーの処理
function pomodoroTime() {
    const now = new Date().getTime();
    const total = endtime - now;
    if (total <= 0) {
        clearInterval(timer); // タイマー終了
        isRunning = false;  //  タイマー終了時にボタン表示と内部状態が違うため
        if (refreshFlag) {
            clock.textContent = "05:00";
            startRefreshTime();
        } else {
            clock.textContent = "25:00";
            startPomodoro();
        }
        return;
    }

    const minute = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const second = Math.floor((total % (1000 * 60)) / 1000);
    //  00:00表記
    clock.textContent = `${padZero(minute)}:${padZero(second)}`;
}

//  ポモドーロタイマーリセット処理
function startPomodoro() {
    endtime = new Date().getTime() + 1000 * 60 * 25;    //  25分後をグローバルに定義、関数で定義すると呼ばれるたびにnew Date().getTime()が更新され、25分差になってしまう
    pomodoroTime();
    timer = setInterval(pomodoroTime, 1000);
    timerBtn.textContent = "停止";
    isRunning = true;
    refreshFlag = true;
}

//  ポモドーロタイマー休憩時間処理
function startRefreshTime() {
    endtime = new Date().getTime() + 1000 * 60 * 5;
    pomodoroTime();
    timer = setInterval(pomodoroTime, 1000);
    refreshFlag = false;
}

function originalStyleAddPip(pipWindow) {
    [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = document.createElement('style');
    
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement('link');
    
          link.rel = 'stylesheet';
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
    });
}



//  ピクチャーインピクチャーボタン押下時の処理
pipBtn.addEventListener("click", async function () {
    // Document Picture-in-Picture API がサポートされているか確認
    if (!("documentPictureInPicture" in window)) {
            alert("ピクチャーインピクチャーはサポートされていません");
            return;
        }
    // ピクチャーインピクチャーに表示する要素を取得
    const pipContent = document.querySelector("#pip");
    // ピクチャーインピクチャーのウィンドウを作成
    const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: pipContent.clientWidth,
        height: pipContent.clientHeight
    });
    // ピクチャーインピクチャーの背景色を設定
    pipBackground = window.getComputedStyle(pipContent).backgroundColor;
    pipWindow.document.body.style.backgroundColor = pipBackground;
    
    //  元のウィンドウからすべてのスタイルシートをピクチャーインピクチャーに追加する。
    originalStyleAddPip(pipWindow)

    //  ピクチャーインピクチャーのボタン要素を非表示にする。
    pipBtn.style.display = "none";
    //  デジタル時計の要素を取得
    const digitalClock = document.querySelector("#clock");
    digitalClock.className = "pipClock";
    // ピクチャーインピクチャーのウィンドウにコンテンツを追加
    pipWindow.document.body.append(pipContent);
    // ピクチャーインピクチャーのウィンドウが閉じられたときにコンテンツを元の位置に戻す
    pipWindow.addEventListener("unload", (event) => {
        const container = document.querySelector("#container");
        const pipContent = event.target.querySelector("#pip");
        digitalClock.className = "";
        pipBtn.style.display = "block";
        container.append(pipContent);
    });        
});

//  初めて画面読み込み後、デジタル時計を実行する
window.addEventListener("load", () => {
    timerBtn.style.display = "none";
    resetBtn.style.display = "none";
    displayTime();
    timer = setInterval(displayTime, 1000);
})

document.getElementById("clockModeBtn").addEventListener("click", () => {
    mode = "clock";
    timerBtn.style.display = "none";
    resetBtn.style.display = "none";
    clearInterval(timer);   //  ポモドーロタイマー停止
    displayTime();
    timer = setInterval(displayTime, 1000);
});

document.getElementById("pomodoroModeBtn").addEventListener("click", () => {
    mode = "pomodoro";
    timerBtn.style.display = "block";
    resetBtn.style.display = "block";
    clearInterval(timer);   //  デジタル時計停止
    clock.textContent = "25:00";
});

//  開始ボタンを押下時、ポモドーロタイマー起動
timerBtn.addEventListener("click", () => {
    if (!isRunning) {
        //  endtimeが未定義だったら新規にセット
        if (!endtime) {
            if (refreshFlag) {
                endtime = new Date().getTime() + 1000 * 60 * 25;
            } else {
                endtime = new Date().getTime() + 1000 * 60 * 5;
            }
            
        } else if (stoptime) {
             // 停止→再開時には endtime を補正
            const now = new Date().getTime();
            const pauseDuration = now - stoptime;
            endtime += pauseDuration;  
            stoptime = null;
        }
        pomodoroTime();
        timer = setInterval(pomodoroTime, 1000);
        stoptime = null //  停止時の時間をリセット
        timerBtn.textContent = "停止";
        isRunning = true;
    } else {
        clearInterval(timer);   //  停止すればよい
        stoptime = new Date().getTime();    //  停止ボタン押下時の時間を保持する。
        timerBtn.textContent = "開始";
        isRunning = false;
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(timer);   //  ポモドーロタイマー停止
    endtime = null  //  終了時刻をリセット
    stoptime = null //  停止時の時間をリセット
    refreshFlag = true; // 作業モードに戻す
    isRunning = false;
    timerBtn.textContent = "開始";
    clock.textContent = "25:00";
})