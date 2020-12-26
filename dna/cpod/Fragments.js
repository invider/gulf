const df = {
    name: 'fragments',
}
class Fragments {

    constructor(st) {
        this.bits = []
        augment(this, df)
        augment(this, st)
    }

    spawn(x, y, fi, color, force) {
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

        const dir = fi + lib.math.rnds() * HALF_PI
                + lib.math.rnds() * rnd(.1 * PI)
        const speed = 5 + rnd(25)
        bit.dx = cos(dir) * speed
        bit.dy = sin(dir) * speed

        if (force > 0) this.spawn(x, y, fi, color, force - 1)
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
