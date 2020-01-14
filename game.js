class GameCanvas {
    constructor(canvas){
        this.canvas = canvas;
        this.frame = 0;
        this.keys = new Set();
        this.paused = false;
    }

    paint(){
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        ctx.fillText(JSON.stringify(Array.from(this.keys)), 10, 10);
        ctx.fillText(this.paused, 10, 20);
        ctx.fillText(this.frame, 10, 30);    
    }
}

let singletonGameCanvas = undefined;


function loop(){
    singletonGameCanvas.paint()
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(300, 150);
    // ctx.stroke();
    singletonGameCanvas.frame++;
    if (!singletonGameCanvas.paused){
        window.requestAnimationFrame(loop);
    }
}


function start(gameCanvas){
    singletonGameCanvas = gameCanvas;
    document.addEventListener('keydown', e => gameCanvas.keys.add(e.keyCode));
    document.addEventListener('keyup', e => gameCanvas.keys.delete(e.keyCode));
    window.addEventListener('focus', () => {
        gameCanvas.paused = false;
        window.requestAnimationFrame(loop);
    });
    window.addEventListener('blur', () => gameCanvas.paused = true);
    window.requestAnimationFrame(loop);
}
