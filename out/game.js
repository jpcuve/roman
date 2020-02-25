class Rectangle {
    constructor(top = 0, left = 0, width = 0, height = 0) {
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}
class GameCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.frame = 0;
        this.keys = new Set();
        this.paused = false;
    }
    paint() {
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        ctx.fillText(JSON.stringify(Array.from(this.keys)), 10, 10);
        ctx.fillText(String(this.paused), 10, 20);
        ctx.fillText(String(this.frame), 10, 30);
    }
}
let singletonGameCanvas = undefined;
const loop = () => {
    singletonGameCanvas.paint();
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(300, 150);
    // ctx.stroke();
    singletonGameCanvas.frame++;
    if (!singletonGameCanvas.paused) {
        window.requestAnimationFrame(loop);
    }
};
const loadAssets = (srcList, fn) => {
    var count = srcList.length;
    for (let src of srcList) {
        var image = new Image();
        image.onload = () => {
            console.log(`Image loaded: ${src}`);
            count--;
            if (count == 0 && fn) {
                fn();
            }
        };
        image.src = src;
    }
};
const start = (gameCanvas) => {
    singletonGameCanvas = gameCanvas;
    document.addEventListener('keydown', e => gameCanvas.keys.add(e.keyCode));
    document.addEventListener('keyup', e => gameCanvas.keys.delete(e.keyCode));
    window.addEventListener('focus', () => {
        gameCanvas.paused = false;
        window.requestAnimationFrame(loop);
    });
    window.addEventListener('blur', () => gameCanvas.paused = true);
    loadAssets(['assets/adventurer.png'], () => window.requestAnimationFrame(loop));
};
//# sourceMappingURL=game.js.map