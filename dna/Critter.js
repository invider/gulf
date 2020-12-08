const df = {
    speed: 0,
    turnSpeed: 1.5,

    minSpeed: 10,
    cruiseSpeed: 20,
    maxSpeed: 60,
    speedUp: 15,
    speedBoost: 70,
    speedDown: 10,
    boostTime: 2,

    jawWidth: PI/4,
    jawOpen: PI/4,
    jawRate: 1,
    jawSpeed: 2,
    jawDir: -1,

    jawForce: 100,
}

let id = 0
class Critter {
    constructor(st) {
        this.fi = lib.math.rndfi()
        this.name = 'critter' + (++id)
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

        if (this.length() % 3 === 0) {
            cell.legLength = 45
        }
    }

    eat(cell) {
        // TODO consume the energy, heal and grow
        const next = lab.sea.bio.spawn(dna.Cell, {
            x: this.tail.x,
            y: this.tail.y,
            r: 8,
        })
        this.attach(next)
    }

    moveTo(x, y) {
        this.target = lib.v2a.create(x, y)
        this.boost = this.boostTime
        this.jawDir = -1
    }

    hit(segment, source, dt) {
        segment.hp -= this.jawForce * dt
        if (segment.hp <= 0) {
            this.cut(segment)
        }
        log(this.name + '/' + segment.name  + ' is hit by ' + source.name + ' !' + floor(segment.hp))
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

    moveJaws(dt) {
        if (this.jawDir < 0) {
            this.jawRate -= this.jawSpeed * dt
            if (this.jawRate < 0) {
                this.jawRate = 0
                this.jawDir = 1
            }
        } else if (this.jawDir > 0) {
            this.jawRate += this.jawSpeed * dt
            if (this.jawRate > 1) {
                this.jawRate = 1
                this.jawDir = -1
            }
        }
    }

    lick(target, dt) {
        if (this.jawDir > 0 || this.jawRate > .25) return
        if (target === this.head || target.parent === this) return
        target.touch(this, dt)
    }

    evo(dt) {
        this.turn(dt)
        this.adjustSpeed(dt)
        this.move(dt)
        this.moveJaws(dt)
    }

    draw() {
        if (this.target) {
            fill('#ff0000')
            circle(this.target[0], this.target[1], 2)
        }

        const x = this.head.x
        const y = this.head.y
        const r = this.head.r

        const width = this.jawWidth
        const opening = this.jawOpen/2 * this.jawRate
        const j1 = this.fi - width - opening
        const w1 = j1 + width 
        const j2 = this.fi + opening
        const w2 = j2 + width

        lineWidth(2)
        stroke( lib.util.teamColor(this.team) )
        arc(x, y, r + 4, j1, w1)
        arc(x, y, r + 4, j2, w2)
    }

    forEach(fn) {
        let cur = this.head
        while(cur) {
            fn(cur)
            cur = cur.next
        }
    }

    length() {
        let len = 0
        let cur = this.head
        while(cur) {
            len ++
            cur = cur.next
        }
        return len
    }

    cut(segment) {
        if (!segment || segment.parent !== this) return

        if (segment.prev) {
            const tail = segment.prev
            this.tail = tail
            tail.next = null
        }

        let cur = segment
        while(cur) {
            const next = cur.next
            cur.free()
            cur = next
        }

        if (this.head === segment) this.kill()
    }

    kill() {
        this.dead = true
        log(this.name + ' is killed!')
    }
}
