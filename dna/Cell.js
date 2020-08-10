const df = {
    team: 0,
    x: 0,
    y: 0,
    r: 10,
    dx: 0,
    dy: 0,
    linkSpeed: 40,
}

let id = 0
class Cell {

    constructor(st) {
        this.name = 'cell' + (++id)
        augment(this, df)
        augment(this, st)
    }

    hit(source) {
        this.kill()
        source.parent.eat(this)
    }

    touch(source) {
        const d = dist(this.x, this.y, source.x, source.y)
        const r = this.r + source.r
        if (d < r) {
            this.hit(source)
        }
    }

    evoTug(dt, target) {
        // find direction on prev segment
        const fi = Math.atan2(this.y-target.y, this.x-target.x)
        const dir = lib.v2a.unit(fi)
        const svec = lib.v2a.scale(dir,
                this.linkSpeed * dt)
        // move cell in the target direction
        this.x -= svec[0]
        this.y -= svec[1]
    }

    evo(dt) {
        this.x += this.dx * dt
        this.y += this.dy * dt

        if (this.prev) {
            const prev = this.prev
            const d = dist(this.x, this.y, prev.x, prev.y)
            if (d > 2.5*this.r) {
                this.evoTug(dt, prev)
            }
        }
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
