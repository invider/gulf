function critter(st) {
    const df = {
        team: 2,
        bot: sys.clone(dna.bot.hunter),
    }
    const creature = lab.sea.tie.spawn(dna.Critter, augment(df, st))

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
