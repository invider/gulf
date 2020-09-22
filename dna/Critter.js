const df = {
    speed: 0,
    turnSpeed: 1.5,

    minSpeed: 10,
    cruiseSpeed: 20,
    maxSpeed: 60,
    speedUp: 15,
    speedBoost: 50,
    speedDown: 10,
    boostTime: 2,
}

class Critter {
    constructor(st) {
        this.fi = lib.math.rndfi()
        augment(this, df)
        augment(this, st)
    }

    attach(cell) {
        cell.parent = this
        cell.team = this.team
        if (!this.head) {
            this.head = cell
            this.tail = cell
        } else {
            cell.prev = this.tail
            this.tail.next = cell
            this.tail = cell
        }
    }

    eat(cell) {
        const next = lab.sea.bio.spawn(dna.Cell, {
            x: this.tail.x,
            y: this.tail.y,
            r: 10,
        })
        this.attach(next)
    }

    moveTo(x, y) {
        this.target = lib.v2a.create(x, y)
        this.boost = this.boostTime
    }

    adjustSpeed(dt) {
        if (this.boost > 0) {
            this.boost -= dt
            this.speed = min(this.speed + this.speedBoost * dt, this.maxSpeed)
        } else if (this.target) {
            if (this.speed > this.cruiseSpeed) {
                this.speed = max(this.speed - this.speedDown * dt, this.cruiseSpeed)
            } else if (this.speed < this.cruiseSpeed) {
                this.speed = min(this.speed + this.speedUp * dt, this.cruiseSpeed)
            }
        } else {
            if (this.speed < this.minSpeed) {
                this.speed = min(this.speed + this.speedUp * dt, this.minSpeed)
            } else {
                this.speed = max(this.speed - this.speedDown * dt, this.minSpeed)
            }
        }
    }

    move(dt) {
        //const svec = lib.v2a.scale(this.dir, this.speed * dt)
        // move head
        this.head.x += cos(this.fi) * this.speed * dt
        this.head.y += sin(this.fi) * this.speed * dt
    }

    turn(dt) {
        if (this.target) {
            const h = this.head
            const t = this.target

            if (this.debug) debugger
            const b = lib.math.normalizeAngle(bearing(h.x, h.y, t[0], t[1]))

            if (this.fi !== b) {
                let left = true
                let tune = true
                if (this.fi < b) {
                    if (b - this.fi < PI) left = false
                    else tune = false
                } else {
                    if (this.fi - b > PI) {
                        left = false
                        tune = false
                    }
                }

                if (left) {
                    this.fi -= this.turnSpeed * dt
                    if (tune && this.fi < b) this.fi = b
                    if (this.fi < 0) this.fi += TAU
                } else {
                    this.fi += this.turnSpeed * dt
                    if (tune && this.fi > b) this.fi = b
                    if (this.fi > TAU) this.fi -= TAU
                }
                h.bearing = b
                h.heading = this.fi
            }


            /*
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
            */
        }
    }

    evo(dt) {
        this.turn(dt)
        this.adjustSpeed(dt)
        this.move(dt)
    }

    draw() {
        if (this.target) {
            fill('#ff0000')
            circle(this.target[0], this.target[1], 2)
        }
    }
}
