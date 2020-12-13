const ROAMING = 0
const PREY = 1

function takeControl() {
    this.state = PREY
    this.timer = 0
}

function nextAction() {
    if (this.state === ROAMING) {
        this.timer = .3 + rnd()
        this.control = RND(3) + 1
        //log(this.parent.name + ': #' + this.control)
    } else if (this.state === PREY) {
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
