const df = {
    team: 0,
    x: 0,
    y: 0,
    r: 10,
    dx: 0,
    dy: 0,
}

class Cell {

    constructor(st) {
        augment(this, df)
        augment(this, st)
    }

    evo(dt) {
        this.x += this.dx * dt
        this.y += this.dy * dt
    }

    draw() {
        lineWidth(2)
        switch(this.team) {
            case 0: stroke(.55, .55, .6); break;
            case 1: stroke(.02, .5, .5); break;
        }
        circle(this.x, this.y, this.r)
    }
}
