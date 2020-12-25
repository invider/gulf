

function population(team) {
    if (!lab.sea) return 0
    let pop = 0

    const ls = lab.sea.tie._ls
    const len = ls.length

    for (let i = 0; i < len; i++) {
        const e = ls[i]
        if (!e.dead && (team === undefined || team === e.team)) {
            pop ++
        }
    }

    return pop
}
