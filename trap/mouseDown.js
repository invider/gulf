function mouseDown(e) {

    const lx = lab.sea.lx(mouse.x)
    const ly = lab.sea.ly(mouse.y)

    if (e.buttons & 1) {
        if (!lab.sea.hero) return
        lab.sea.hero.moveTo(lx, ly)

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
                lab.sea.follow(target.parent.head, true)
                lab.sea.hero = target.parent
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
