class Rectangle {
    constructor(left = 0, top = 0, width = 0, height = 0) {
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}
class Asset {
    constructor(location, tiles) {
        this.location = location;
        this.tiles = tiles;
        this.image = undefined;
    }
    loadImage(fn) {
        this.image = new Image();
        this.image.onload = fn;
        this.image.src = this.location;
    }
    paint(ctx, tileName, x, y) {
        let r = this.tiles.get(tileName);
        ctx.drawImage(this.image, r.left, r.top, r.width, r.height, x, y, r.width, r.height);
    }
}
const assets = [
    new Asset('assets/adventurer.png', new Map([
        ['stand_0', new Rectangle(0, 0, 50, 37)],
        ['stand_1', new Rectangle(50, 0, 50, 37)],
        ['stand_2', new Rectangle(100, 0, 50, 37)],
        ['stand_3', new Rectangle(150, 0, 50, 37)],
    ]))
];
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
        assets[0].paint(ctx, `stand_${Math.floor(this.frame / 7) % 4}`, 30, 30);
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
const loadAssets = (assets, fn) => {
    var count = assets.length;
    assets.forEach(asset => {
        asset.loadImage(() => {
            count--;
            if (count == 0 && fn) {
                fn();
            }
        });
    });
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
    loadAssets(assets, () => window.requestAnimationFrame(loop));
};
//# sourceMappingURL=game.js.map