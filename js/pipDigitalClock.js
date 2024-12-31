const pipBtn = document.getElementById('pipBtn');
const clock = document.querySelector("#clock");  //  displayTime関数内でclock要素を取得すると、関数内でしかclock要素を取得していないため、ピクチャーインピクチャーで表示したとき動かない

function displayTime() {
    //  00:00:00表記
    const padZero = value => value.toString().padStart(2, '0');
    const now = new Date();
    const hour = padZero(now.getHours());
    const minute = padZero(now.getMinutes());
    const second = padZero(now.getSeconds());

    //  現在時刻を文字列にして、ブラウザに表示
    clock.textContent = `${hour}:${minute}:${second}`;
}
    
displayTime();
setInterval(displayTime, 1000);
            
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
    pipWindow.document.body.style.margin = "0";
    // ピクチャーインピクチャーのウィンドウにコンテンツを追加
    pipWindow.document.body.append(pipContent);
    // ピクチャーインピクチャーのウィンドウが閉じられたときにコンテンツを元の位置に戻す
    pipWindow.addEventListener("unload", (event) => {
        const container = document.querySelector("#container");
        const pipContent = event.target.querySelector("#pip");
        container.append(pipContent);
    });        
});