const df = {
    x: 0,
    y: 0,
    r: 10,
    dx: 0,
    dy: 0,
}

class Cell {

    constructor(st) {
        augment(this, df)
        augment(this, st)
    }

    evo(dt) {
        this.x += this.dx * dt
        this.y += this.dy * dt
    }

    draw() {
        lineWidth(2)
        stroke(.55, .55, .6)
        circle(this.x, this.y, this.r)
    }
}
