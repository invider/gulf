const df = {
    team: 0,
    next: null,
    prev: null,
    parent: null,
    hp: 10,

    x: 0,
    y: 0,
    r: 10, // cell radius
    l: 30, // link length
    dx: 0,
    dy: 0,

    linkR: 1.5,
    linkSpeed: 50,
    linkSpeed2: 110,
    tugIn:   1.2, // in link lengths
    tugIn2:  1.5,
    tugOut:  0.7,
    tugOut2: 0.4,
    maxLinkLen: 1.5,

    legLength: 0,
    legsTension: 0,
    tensionSpeed: 2,

    driftSpeed: 15,
    driftTime:  1,
    driftTimer: 0,
}

let id = 0
class Cell {

    constructor(st) {
        this.name = 'cell' + (++id)
        augment(this, df)
        augment(this, st)

    }

    hit(source, dt) {
        if (!source) return
        if (!this.parent) {
            this.kill()
            source.parent.eat(this)
        } else {
            this.parent.hit(this, source, dt)
        }
    }

    touch(critter, dt) {
        if (!critter) return
        const head = critter.head
        if (!head) return

        const jx = head.x + cos(critter.fi) * head.r
        const jy = head.y + sin(critter.fi) * head.r

        const d = dist(this.x, this.y, jx, jy)
        const r = this.r + head.r * .5
        if (d < r) {
            this.hit(head, dt)
        }
    }

    evoDrift(dt, target) {
        const fi = lab.sea.current.at(this.x, this.y)
        const cvec = lib.v2a.unit(fi)

        const svec = lib.v2a.scale(cvec, this.driftSpeed * dt)
        // drift cell by the current
        this.x += svec[0]
        this.y += svec[1]

        // ease legs tension
        this.legsTension = max( this.legsTension
            - this.tensionSpeed * dt, 0)

        /*
        this.driftTimer -= dt

        if (this.driftTimer <= 0) {
            // pick a random direction 
            let fi = Math.atan2(this.y-target.y, this.x-target.x)
            fi = fi + HALF_PI * lib.math.rnds()
            this.dir = lib.v2a.unit(fi)
            this.driftTimer = this.driftTime + this.driftTime * rnd()
        }

        const svec = lib.v2a.scale(this.dir,
                this.driftSpeed * dt)
        // move cell in the target direction
        this.x -= svec[0]
        this.y -= svec[1]
        */
    }

    evoTug(dt, target, speed) {
        // find direction on prev segment
        const fi = Math.atan2(this.y-target.y, this.x-target.x)
        const dir = lib.v2a.unit(fi)
        const svec = lib.v2a.scale(dir,
                speed * dt)
        // move cell in the target direction
        this.x -= svec[0]
        this.y -= svec[1]

        // build up legs tension
        this.legsTension = min(this.legsTension
            + this.tensionSpeed * dt, 1)
    }

    evo(dt) {
        if (this.prev) {
            // tag along
            const prev = this.prev
            const d = dist(this.x, this.y, prev.x, prev.y)

            if (d > this.tugIn2 * this.l) {
                this.evoTug(dt, prev, this.linkSpeed2)
            } else if (d > this.tugIn * this.l) {
                this.evoTug(dt, prev, this.linkSpeed)
            } else if (d < this.tugOut2 * this.l) {
                this.evoTug(dt, prev, -this.linkSpeed2)
            } else if (d < this.tugOut * this.l) {
                this.evoTug(dt, prev, -this.linkSpeed)
                
            } else {
                this.evoDrift(dt, prev)
            }
        } else {
            // just drift
            this.x += this.dx * dt
            this.y += this.dy * dt

            if (this.lifespan > 0) {
                this.lifespan -= dt
                if (this.lifespan <= 0) {
                    this.kill()
                }
            }
        }
    }

    drawLeg(fi) {

        const r1 = this.r
        const r2 = this.legLength
        const x1 = cos(fi) * r1
        const y1 = sin(fi) * r1
        const x2 = cos(fi) * r2
        const y2 = sin(fi) * r2

        stroke( lib.util.teamColor(this.team) )

        alpha(.1)
        lineWidth(12)
        line(x1, y1, x2, y2)

        alpha(.3)
        lineWidth(4)
        line(x1, y1, x2, y2)


        alpha(1)
        lineWidth(1)
        line(x1, y1, x2, y2)

        fill( lib.util.teamColor(this.team) )
        circle( cos(fi) * r2, sin(fi) * r2, this.linkR)
    }

    draw() {
        save()
        translate(this.x, this.y)

        const color = lib.util.teamColor(this.team) 

        alpha(.04)
        fill( color )
        circle(0, 0, this.r * 1.2)

        stroke( color )

        alpha(.08)
        lineWidth(8)
        circle(0, 0, this.r)

        alpha(.2)
        lineWidth(4)
        circle(0, 0, this.r)

        alpha(1)

        stroke( color )
        if (this.selected) lineWidth(3)
        else lineWidth(1)
        circle(0, 0, this.r)
        if (this.prev) {
            //line(0, 0, this.prev.x - this.x, this.prev.y - this.y)
            const px = this.prev.x - this.x
            const py = this.prev.y - this.y
            const fi = atan2(py, px)

            fill( color )
            circle(
                px/2,
                py/2,
                this.linkR
            )

            if (this.legLength > 0) {
                this.drawLeg(fi + (1.25 - .1 * this.legsTension)*PI)
                this.drawLeg(fi - (1.25 - .1 * this.legsTension)*PI)
            }
        }

        /*
        if (this.bearing) {
            stroke(.01, .5, .5)
            line(
                cos(this.bearing) * this.r,
                sin(this.bearing) * this.r,
                cos(this.bearing) * this.r*1.5,
                sin(this.bearing) * this.r*1.5)
        }
        if (this.heading) {
            stroke(.75, .5, .5)
            line(0, 0, cos(this.heading) * 25, sin(this.heading) * 25)
        }
        */

        restore()
    }

    drift() {
        this.dx = RND(40) - 20
        this.dy = RND(20) - 10
    }

    free() {
        this.parent = null
        this.next = null
        this.prev = null
        this.drift()
    }

    kill() {
        this.dead = true
    }
}
