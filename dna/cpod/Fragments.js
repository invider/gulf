const df = {
    name: 'fragments',
}
class Fragments {

    constructor(st) {
        this.bits = []
        augment(this, df)
        augment(this, st)
    }

    spawn(x, y, color, force) {
        // find empty slot
        let bit
        for (let i = 0; i < this.bits.length; i++) {
            const e = this.bits[i]
            if (e.dead) bit = e
        }
        if (!bit) {
            bit = {}
            this.bits.push(bit)
        }

        bit.dead = false
        bit.lifespan = 1 + 2*rnd()
        bit.color = color
        bit.x = x
        bit.y = y

        const fi = lib.math.rndfi()
        bit.dx = cos(fi) * 20
        bit.dy =  sin(fi) * 20

        if (force > 0) this.spawn(x, y, color, force - 1)
    }

    evo(dt) {
        for (let i = 0; i < this.bits.length; i++) {
            const bit = this.bits[i]
            if (!bit.dead) {
                bit.x += bit.dx * dt
                bit.y += bit.dy * dt
                bit.lifespan -= dt
                if (bit.lifespan < 0) bit.dead = true
            }
        }
    }

    draw() {
        for (let i = 0; i < this.bits.length; i++) {
            const bit = this.bits[i]
            if (!bit.dead) {
                lineWidth(2)
                fill(bit.color)
                plot(bit.x, bit.y)
            }
        }
    }
}
