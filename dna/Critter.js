const df = {
    speed: 10,
}

class Critter {
    constructor(st) {
        augment(this, df)
        augment(this, st)
    }

    moveTo(x, y) {
        this.target = lib.v2a.create(x, y)
    }

    evo(dt) {
        if (this.target) {
            const h = this.head
            const t = this.target
            const l = len(h.x - t[0],
                            h.y - t[1])
            if (l > 1) {
                const fi = Math.atan2(h.y-t[1], h.x-t[0])
                const dir = lib.v2a.unit(fi)
                const svec = lib.v2a.scale(dir,
                        this.speed * dt)
                // move head
                h.x -= svec[0]
                h.y -= svec[1]
            }
        }
    }

    draw() {
        if (this.target) {
            fill('#ff0000')
            circle(this.target[0], this.target[1], 5)
        }
    }
}
