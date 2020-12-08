function evo(dt) {
    const ls = this.__.tie._ls
    const tls = this.__.bio._ls

    const I = ls.length
    const J = tls.length
    for (let i = 0; i < I; i++) {
        const critter = ls[i]
        if (critter.head && !critter.dead) {
            for (let j = 0; j < J; j++) {
                const target = tls[j]
                if (!target.dead && target.touch) {
                    critter.lick(target, dt)
                    //target.touch(head)
                }
            }
        }
    }
}
