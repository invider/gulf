function critter() {
    const creature = lab.sea.tie.spawn(dna.Critter, {
        team: 2,
        bot: sys.clone(dna.bot.hunter),
    })

    creature.attach( lab.sea.bio.spawn(dna.Cell, {
        x: 0,
        y: 0,
        r: 15,
    }))

    creature.attach( lab.sea.bio.spawn(dna.Cell, {
        x: 0,
        y: 0,
        r: 10,
    }))
}
