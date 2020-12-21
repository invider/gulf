const df = {
    team: 0,
    x: 0,
    y: 0,
    r: 25,
    timer: 0,
    frequency: 2.5,
}

class Source {

    constructor(st) {
        augment(this, df, st)
    }

    evo(dt) {
        this.timer += dt
        if (this.timer > this.frequency) {
            lab.sea.bio.spawn(dna.Cell, {
                team: this.team,
                x: this.x,
                y: this.y,
                r: 10,
                dx: RND(40) - 20,
                dy: RND(20) - 10,
                lifespan: 30,
            })
            this.timer = 0
        }
    }

    draw() {
        stroke(.88, .5, .5)

        alpha(.4)
        lineWidth(5)
        circle(this.x, this.y, this.r)

        alpha(1)
        lineWidth(1)
        circle(this.x, this.y, this.r)
    }
}
