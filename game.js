let canvas = undefined;
let counter = 0;
let keys = new Set();


function loop(){
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillText(JSON.stringify(Array.from(keys)), 10, 10);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(300, 150);
    ctx.stroke();
    counter++;
    window.requestAnimationFrame(loop);
}


function start(){
    canvas = document.getElementById('surface');
    document.addEventListener('keydown', e => keys.add(e.keyCode));
    document.addEventListener('keyup', e => keys.delete(e.keyCode));
    window.requestAnimationFrame(loop);
}