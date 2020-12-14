function mouseDown(e) {

    const lx = lab.sea.lx(mouse.x)
    const ly = lab.sea.ly(mouse.y)

    if (e.buttons & 1) {
        if (!lab.sea.hero) {
            lab.sea.moveTo(lx, ly)
        } else {
            if (lab.sea.hero.dead) {
                lab.sea.release()
                lab.sea.moveTo(lx, ly)
            } else {
                lab.control.setTarget(lx, ly)
            }
        }

        // mark the click with a blip
        lab.sea.fx.spawn(dna.fx.Blip, {
            x: lx,
            y: ly,
            width: 3,
            alpha: .3,
            speed: 120,
            timespan: .3,
        })

    } else if (e.buttons & 2) {
        const ls = []
        lab.sea.bio.pick(lx, ly, ls)

        if (ls.length > 0) {
            const target = ls[0]

            if (env.selected) {
                env.selected.selected = false
            }
            target.selected = true
            env.selected = target

            if (target.parent && target.parent.head === target) {
                // pin the camera to the head
                lab.sea.pin(target.parent)
            }

            if (target.parent) {
                log(target.parent.name + '/' + target.name)
            } else {
                log(target.name)
            }
            console.dir(target)
            if (target.parent) console.dir(target.parent)
        }
    }
}
