const NOTHING = 0
const FOLLOW_TARGET = 1
const DISTANCIATE = 2
const CIRCLE = 3

const df = {
    team: 0,
    player: 0,
    action: NOTHING,

    speed: 0,
    turnSpeed: 1.5,
    minSpeed: 20,
    cruiseSpeed: 40,
    maxSpeed: 100,
    speedUp: 20,
    speedBoost: 200,
    speedDown: 20,
    boostTime: .3,
    targetPrecision: 25,
    distanciateTime: 4,
    circleTime: 8,

    scanRadius: 1000,

    jawWidth: PI/4,
    jawOpen: PI/4,
    jawRate: 1,
    jawSpeed: 2,
    jawDir: -1,

    jawForce: 50,
}

let id = 0
class Critter {
    constructor(st) {
        this.fi = lib.math.rndfi()
        this.name = 'critter' + (++id)

        augment(this, df)
        augment(this, st)
        supplement(this, dna.trait.podable)

        this.installPod(new dna.cpod.Fragments())

        // set default bot
        if (!this.bot) {
            this.bot = sys.clone(dna.bot.hunter)
        }
        this.bot.parent = this
        this.bot.takeControl()
    }

    attach(cell) {
        cell.parent = this
        cell.team = this.team
        if (!this.head) {
            // first segment
            this.head = cell
            this.head.installPod(new dna.pod.Jaw())
            this.tail = cell
        } else {
            cell.prev = this.tail
            this.tail.next = cell
            this.tail = cell
        }

        if (this.length() % 3 === 0) {
            cell.legLength = 45
        }

        lab.sea.fx.spawn(dna.fx.Blip, {
            x: cell.x,
            y: cell.y,
            width: 3,
            alpha: .3,
            speed: 250,
            timespan: .7,
            color: lib.util.teamColor(this.team),
        })

        const SPLIT = 6
        if (this.length() >= 2*SPLIT) {
            this.split(SPLIT)
        }
    }

    eat(cell) {
        const hp = this.heal(cell.hp)
        this.upgrade(hp)
        this.bite(cell.team, 15)
    }

    heal(hp) {
        let cur = this.head
        while(cur && hp > 0) {
            hp = cur.heal(hp)
            cur = cur.next
        }
        return hp
    }

    upgrade(hp) {
        hp = min(floor(hp / 5) * 5, 30)
        if (this.tail.targetLevel > this.tail.level) {
            this.tail.promote(hp)
        } else {
            this.grow(hp)
        }
    }

    grow(hp) {
        if (hp < 10) return

        const targetLevel = RND(1, 5)
        const next = lab.sea.bio.spawn(dna.Cell, {
            x: this.tail.x,
            y: this.tail.y,
            r:  10,
            hp: 10,
            targetLevel: targetLevel,
        })
        this.attach(next)
    }

    moveTo(x, y) {
        this.action = FOLLOW_TARGET
        this.target = lib.v2.create(x, y)
        this.boost = this.boostTime
        this.jawDir = -1
    }

    follow(target) {
        this.action = FOLLOW_TARGET
        this.target = target
        this.boost = this.boostTime
    }

    turnAt(dir) {
        this.target = null
        this.targetDir = dir
        this.boost = this.boostTime
    }

    hit(segment, source, dt) {
        segment.hp -= this.jawForce * dt
        if (segment.hp <= 0) {
            this.cut(segment)
        }
        //log(this.name + '/' + segment.name  + ' is hit by ' + source.name + ' !' + floor(segment.hp))
    }

    scan() {
        const bio = {
            prey: [],
            plankton: [],
        }

        const h = this.head
        const ls = lab.sea.bio._ls
        const R = this.scanRadius * this.scanRadius

        for (let i = 0; i < ls.length; i++) {
            const cell = ls[i]
            const d = lib.math.distanceSq(h.x, h.y, cell.x, cell.y)

            if (d < R) {
                if (cell.parent) {
                    if (cell.parent.team !== this.team) {
                        bio.prey.push(cell)
                    }
                } else {
                    bio.plankton.push(cell)
                }
            }
        }
        return bio
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

    turnLeft(dt) {
        this.fi -= this.turnSpeed * dt
    }

    turnRight(dt) {
        this.fi += this.turnSpeed * dt
    }

    rush(dt) {
        this.boost = this.boostTime
    }

    slowDown(dt) {
        this.boost = 0
    }

    turnAtBearing(b, dt) {
        const h = this.head
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
    }

    turnOnTarget(dt) {
        const h = this.head
        const t = this.target

        const b = lib.math.normalizeAngle(bearing(h.x, h.y, t.x, t.y))
        this.turnAtBearing(b, dt)
    }

    circleTarget(dt) {
        const h = this.head
        const t = this.target

        const b = lib.math.normalizeAngle(bearing(h.x, h.y, t.x, t.y) - HALF_PI)
        this.turnAtBearing(b, dt)
    }

    // TODO move to Jaws pod
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
        if (!env.opt.friendlyAttack && target.parent
                && target.team === this.team) return
        target.touch(this, dt)
    }

    bite(team, force) {
        const head = this.head
        const x = head.x + cos(this.fi) * head.r
        const y = head.y + sin(this.fi) * head.r
        const color = lib.util.teamColor(team)
        this.fragments.spawn(x, y, this.fi, color, force)
    }

    evo(dt) {
        switch(this.action) {
            case FOLLOW_TARGET:
                if (this.target) {
                    this.turnOnTarget(dt)
                    if (this.target.dead) this.action = NOTHING

                    const d = lib.math.distanceSq(this.head.x, this.head.y,
                        this.target.x, this.target.y)
                    if (d < this.targetPrecision) {
                        this.action = DISTANCIATE
                        this.timer = this.distanciateTime
                        if (this.onReached) {
                            this.onReached()
                        }
                    }
                }
                break

            case DISTANCIATE:
                this.timer -= dt
                if (this.timer < 0) {
                    if (this.target) {
                        this.action = CIRCLE
                        this.timer = this.circleTime + RND(this.circleTime)
                    } else {
                        this.action = NOTHING
                    }
                }
                break

            case CIRCLE:
                this.circleTarget(dt)
                this.timer -= dt
                if (this.timer < 0) {
                    if (this.target) {
                        this.action = FOLLOW_TARGET
                        this.boost = this.boostTime
                    } else {
                        this.action = NOTHING
                    }
                }
                break

            default:
                this.slowDown(dt)
                break
        }

        this.adjustSpeed(dt)
        this.move(dt)
        this.moveJaws(dt)
        if (!this.player) {
            this.bot.evo(dt)
        }

        // evolve pods
        for (let i = 0; i < this.pods.length; i++) {
            const pod = this.pods[i]
            if (pod && pod.evo) pod.evo(dt)
        }
    }

    draw() {
        // draw pods
        for (let i = 0; i < this.pods.length; i++) {
            const pod = this.pods[i]
            if (pod && pod.draw) pod.draw()
        }

        // highlight target
        if (this.target) {
            fill( lib.util.teamColor(this.team) )
            circle(this.target.x, this.target.y, 2)
        }

        /*
        fill(.12, .5, .5)
        baseMiddle()
        alignCenter()
        font('24px moon')
        text(''+this.player, x, y)
        */

        if (env.config.showGoal) {
            fill( lib.util.teamColor(this.team) )
            baseBottom()
            alignCenter()
            font('24px moon')
            text(this.getGoal(), x, y - 20)
        }
    }

    activate(id) {
        if (id >= 1 && id <=3) {
            this.target = null
        }
        if (id === 2) this.jawDir = -1
    }

    act(id, dt) {
        switch(id) {
            case 1: this.turnLeft(dt);  break;
            case 2: this.rush(dt); break;
            case 3: this.turnRight(dt); break;
            case 4: this.slowDown(dt); break;
        }
    }

    getTargetLabel() {
        let target = 'target'
        if (this.target) {
            if (this.target.parent) target = this.target.parent.name
            else if (this.target.name) target = this.target.name
            else target = '' + round(this.target.x) + 'x' + round(this.target.y)
        }
        return target
    }

    getGoal() {
        let action = ''
        switch(this.action) {
            case NOTHING:       action = 'nothing';     break;
            case FOLLOW_TARGET:
                action = 'follow ' + this.getTargetLabel()
                break
            case DISTANCIATE:
                action = 'distanciate from ' + this.getTargetLabel()
                break
            case CIRCLE:
                action = 'circle ' + this.getTargetLabel()
                break
        }

        return action
    }

    forEach(fn) {
        let cur = this.head
        while(cur) {
            fn(cur)
            cur = cur.next
        }
    }

    segment(i) {
        let j = 0
        let cur = this.head
        while(cur && j < i) {
            j++
            cur = cur.next
        }
        return cur
    }

    health(i) {
        i = i || 1
        let hp = 0
        let cur = this.head
        while(cur && i > 0) {
            hp += cur.hp
            cur = cur.next
            i--
        }
        return hp
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

    split(i) {
        const df = {
            team: this.team,
            bot: sys.clone(this.bot._dna),
        }
        const creature = lab.sea.tie.spawn(dna.Critter, df)

        let cur = this.segment(i)
        if (!cur) return

        // cut the tail
        this.tail = cur.prev
        this.tail.next = null
        cur.prev = null
        creature.head = cur
        creature.head.r = 15
        creature.head.legLength = 0

        let last
        while(cur) {
            cur.parent = creature
            last = cur
            cur = cur.next
        }
        creature.tail = last
    }

    cut(segment) {
        if (!segment || segment.parent !== this) return
        if (segment.next && segment.next.hp > 0) return

        if (segment === this.head) {
            if (this.health(3) <= 0) this.kill()
            else return
        }

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

        lab.sea.sfx('hit', segment.x, segment.y, this)
    }

    onReached() {}

    kill() {
        log(this.name + ' is killed!')
        this.dead = true

        const self = this
        defer(() => { 
            self.__.detach(self)
        })
    }
}
