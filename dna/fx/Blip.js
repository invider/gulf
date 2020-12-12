const df = {
    x: 0,
    y: 0,
    r: 0,
    timespan: .7,
    speed: ry(.5),
    width: 1,
    color: '#ffffff',
}

let id = 0
class Blip {
    constructor(st) {
        this.name = 'blip' + (++id)
        augment(this, df, st)
    }

    evo(dt) {
        if (this.dead) return
        this.r += this.speed * dt
        this.timespan -= dt
        if (this.timespan < 0) {
            kill(this)
        }
    }

    draw() {
        alpha(this.alpha)
        stroke(this.color)
        lineWidth(this.width)
        circle(this.x, this.y, this.r)
        alpha(1)
    }
}
