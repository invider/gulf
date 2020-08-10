function evo(dt) {
    const ls = this.__.tie._ls
    const tls = this.__.bio._ls

    const I = ls.length
    const J = tls.length
    for (let i = 0; i < I; i++) {
        const e = ls[i]
        if (e.head && !e.dead) {
            const head = e.head
            for (let j = 0; j < J; j++) {
                const target = tls[j]
                if (!target.dead
                        && target.touch
                        && target !== head
                        && (!target.parent || target.parent !== e)) {
                    target.touch(head)
                }
            }
        }
    }
}
