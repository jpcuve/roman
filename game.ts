class Rectangle {
    top: number = 0
    left: number = 0
    width: number = 0
    height: number = 0

    constructor(top: number = 0, left: number = 0, width: number = 0, height: number = 0){
        this.top = top
        this.left = left
        this.width = width
        this.height = height
    }
}

class Asset {
    location: string
    tiles: Map<string, Rectangle>

    constructor(location: string, tiles: Map<string, Rectangle>){
        this.location = location
        this.tiles = tiles
    }
}

const assets: Asset[] = [
    new Asset('assets/adventurer.png', new Map<string, Rectangle>([
        ['one', new Rectangle(0, 0, 10, 10)]
    ]))
]

class GameCanvas {
    canvas: HTMLCanvasElement
    frame: number
    keys: Set<number>
    paused: boolean

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas
        this.frame = 0
        this.keys = new Set()
        this.paused = false
    }

    paint(): void {
        let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')
        ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
        ctx.fillText(JSON.stringify(Array.from(this.keys)), 10, 10)
        ctx.fillText(String(this.paused), 10, 20)
        ctx.fillText(String(this.frame), 10, 30)    
    }
}

let singletonGameCanvas: GameCanvas = undefined



const loop = () => {
    singletonGameCanvas.paint()
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(300, 150);
    // ctx.stroke();
    singletonGameCanvas.frame++
    if (!singletonGameCanvas.paused){
        window.requestAnimationFrame(loop)
    }
}

const loadAssets = (srcList: string[], fn: () => void) => {
    var count = srcList.length
    for (let src of srcList){
        var image = new Image()
        image.onload = () => {
            console.log(`Image loaded: ${src}`)
            count--
            if (count == 0 && fn){
                fn()
            }
        }
        image.src = src
    }
}


const start = (gameCanvas: GameCanvas) => {
    singletonGameCanvas = gameCanvas
    document.addEventListener('keydown', e => gameCanvas.keys.add(e.keyCode))
    document.addEventListener('keyup', e => gameCanvas.keys.delete(e.keyCode))
    window.addEventListener('focus', () => {
        gameCanvas.paused = false
        window.requestAnimationFrame(loop)
    })
    window.addEventListener('blur', () => gameCanvas.paused = true)
    loadAssets(['assets/adventurer.png'], () => window.requestAnimationFrame(loop))    
}
