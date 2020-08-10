const df = {
    team: 0,
    x: 0,
    y: 0,
    r: 10,
    dx: 0,
    dy: 0,
}

let id = 0
class Cell {

    constructor(st) {
        this.name = 'cell' + (++id)
        augment(this, df)
        augment(this, st)
    }

    hit() {
        this.kill()
    }

    touch(source) {
        const d = dist(this.x, this.y, source.x, source.y)
        const r = this.r + source.r
        if (d < r) {
            this.hit()
        }
    }

    evo(dt) {
        this.x += this.dx * dt
        this.y += this.dy * dt
    }

    draw() {
        lineWidth(1)
        switch(this.team) {
            case 0: stroke(.55, .55, .6); break;
            case 1: stroke(.02, .5, .5); break;
        }
        circle(this.x, this.y, this.r)
    }

    kill() {
        this.dead = true
    }
}
