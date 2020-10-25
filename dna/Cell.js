const df = {
    team: 0,
    x: 0,
    y: 0,
    r: 10,
    dx: 0,
    dy: 0,

    linkSpeed: 60,

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

    hit(source) {
        this.kill()
        source.parent.eat(this)
    }

    touch(critter) {
        const head = critter.head
        const jx = head.x + cos(critter.fi) * head.r
        const jy = head.y + sin(critter.fi) * head.r

        const d = dist(this.x, this.y, jx, jy)
        const r = this.r + head.r * .5
        if (d < r) {
            this.hit(head)
        }
    }

    evoDrift(dt, target) {
        const fi = lab.sea.current.at(this.x, this.y)
        const cvec = lib.v2a.unit(fi)

        const svec = lib.v2a.scale(cvec, this.driftSpeed * dt)
        // drift cell by the current
        this.x += svec[0]
        this.y += svec[1]

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
    }

    evo(dt) {
        if (this.prev) {
            // tag along
            const prev = this.prev
            const d = dist(this.x, this.y, prev.x, prev.y)
            if (d > 3*this.r) {
                this.evoTug(dt, prev, this.linkSpeed)
            } else if (d < 2*this.r) {
                this.evoTug(dt, prev, -this.linkSpeed)

            } else {
                this.evoDrift(dt, prev)
            }
        } else {
            // just drift
            this.x += this.dx * dt
            this.y += this.dy * dt
        }
    }

    draw() {
        save()
        translate(this.x, this.y)

        lineWidth(1)
        stroke( lib.util.teamColor(this.team) )
        circle(0, 0, this.r)
        if (this.prev) {
            line(0, 0, this.prev.x - this.x, this.prev.y - this.y)
        }

        if (this.bearing) {
            stroke(.01, .5, .5)
            line(0, 0, cos(this.bearing) * 35, sin(this.bearing) * 35)
        }
        if (this.heading) {
            stroke(.75, .5, .5)
            line(0, 0, cos(this.heading) * 25, sin(this.heading) * 25)
        }

        restore()
    }

    kill() {
        this.dead = true
    }
}
