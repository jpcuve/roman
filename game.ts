class Rectangle {
    top: number = 0
    left: number = 0
    width: number = 0
    height: number = 0

    constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0){
        this.left = left
        this.top = top
        this.width = width
        this.height = height
    }
}

class Asset {
    location: string
    tiles: Map<string, Rectangle>
    image: HTMLImageElement

    constructor(location: string, tiles: Map<string, Rectangle>){
        this.location = location
        this.tiles = tiles
        this.image = undefined
    }

    loadImage(fn: () => void): void {
        this.image = new Image()
        this.image.onload = fn
        this.image.src = this.location
    }

    paint(ctx: CanvasRenderingContext2D, tileName: string, x: number, y: number): void {
        let r = this.tiles.get(tileName)
        ctx.drawImage(this.image, r.left, r.top, r.width, r.height, x, y, r.width, r.height)

    }
}

const assets: Asset[] = [
    new Asset('assets/adventurer.png', new Map<string, Rectangle>([
        ['stand_0', new Rectangle(0, 0, 50, 37)],
        ['stand_1', new Rectangle(50, 0, 50, 37)],
        ['stand_2', new Rectangle(100, 0, 50, 37)],
        ['stand_3', new Rectangle(150, 0, 50, 37)],
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
        assets[0].paint(ctx, `stand_${Math.floor(this.frame / 7) % 4}`, 30, 30)
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

const loadAssets = (assets: Asset[], fn: () => void) => {
    var count: number = assets.length
    assets.forEach(asset => {
        asset.loadImage(() => {
            count--
            if (count == 0 && fn){
                fn()
            }
        })
    })
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
    loadAssets(assets, () => window.requestAnimationFrame(loop))    
}
