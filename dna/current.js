function onSpawn() {
    this.timer = 0
}

function at(x, y) {
    return this.dir
}

function pickDirection() {
    this.dir = lib.math.rndfi()
}

function evo(dt) {
    this.timer -= dt
    if (this.timer < 0) {
        this.timer = env.tune.minCurrentTime + env.tune.varCurrentTime*rnd()
        this.pickDirection()
    }
}

function draw() {
    save()
    rotate(this.dir)

    // show current direction
    //const dx = cos(this.dir) * 20
    //const dy = sin(this.dir) * 20
    const dx = 20
    const dy = 0

    //fill(.50, .4, .4)
    //lineWidth(4)
    //plot(-2, -2)

    stroke(.55, .5, .5)
    ctx.setLineDash([4, 4]);
    lineWidth(2)
    line(0, 0, 50, 0)
    line(50, 0, 30, -10)
    line(50, 0, 30, 10)

    restore()
}
