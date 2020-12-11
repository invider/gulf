const ROAMING = 0

function take() {
    this.state = ROAMING
    this.timer = 0
}

function nextAction() {
    if (this.state === ROAMING) {
        this.timer = .3 + rnd()
        this.control = RND(3) + 1
        log(this.parent.name + ': #' + this.control)
    }
}

function evo(dt) {
    this.timer -= dt
    if (this.timer < 0) this.nextAction()

    switch(this.control) {
        case 1: this.parent.rush(dt); break;
        case 2: this.parent.turnLeft(dt); break;
        case 3: this.parent.slowDown(dt); break;
        case 4: this.parent.turnRight(dt); break;
    }
}

function release() {
}
