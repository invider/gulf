const ROAMING = 0
const PREYING = 1
const BASE = 2

function takeControl() {
    this.state = PREYING
    this.timer = 0
}

function nextAction() {
    if (this.state === ROAMING) {
        this.timer = .3 + rnd()
        this.control = RND(3) + 1
        //log(this.parent.name + ': #' + this.control)
    } else if (this.state === PREYING) {
        const bio = this.parent.scan()
        let target

        if (lib.math.rnds() < 0) {
            if (bio.prey.length > 0) {
                target = lib.math.rnde(bio.prey)
            }
        } else {
            if (bio.plankton.length > 0) {
                target = lib.math.rnde(bio.plankton)
            }
        }

        if (target) {
            this.parent.follow(target)
            this.timer = 15
        } else {
            this.state = BASE
        }
    }  else if (this.state === BASE) {
        const target = lib.v2.create(0, 0)
        if (this.parent.head.dist(target) > 1000) {
            this.parent.follow(target)
            this.timer = 15
        } else {
            this.state = PREYING
            this.timer = 0
        }
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

function releaseControl() {
}

function getGoal() {
    switch(this.state) {
        case ROAMING: return 'roaming';
        case PREYING: return 'preying';
        case BASE:    return 'basing';
    }
}
