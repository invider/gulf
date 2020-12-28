const DOT = 1
const CIRCLE = 2

const df = {
    name: 'fragments',
}
class Fragments {

    constructor(st) {
        this.bits = []
        augment(this, df)
        augment(this, st)
    }

    spawn(st, force) {
        //spawn(x, y, fi, color, force, type) {
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
        bit.color = st.color
        bit.type = st.type
        bit.x = st.x
        bit.y = st.y

        let dir
        if (st.fi) {
            dir = st.fi + lib.math.rnds() * HALF_PI
                + lib.math.rnds() * rnd(.1 * PI)
        } else {
            dir = rnd() * TAU
        }
        const speed = 5 + rnd(25)
        bit.dx = cos(dir) * speed
        bit.dy = sin(dir) * speed

        if (force > 0) this.spawn(st, force - 1)
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
                switch(bit.type) {
                    case DOT:
                        lineWidth(2)
                        fill(bit.color)
                        plot(bit.x, bit.y)
                        break
                    case CIRCLE:
                        lineWidth(1)
                        stroke(bit.color)
                        circle(bit.x, bit.y, 5)
                        break
                }
            }
        }
    }
}
