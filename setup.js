function setup() {
    lib.gen.camera()

    trap('source')
    trap('source')
    trap('source')

    const hero = lab.sea.tie.spawn(dna.Critter, {
        team: 1,
        name: 'hero',
    })

    hero.attach( lab.sea.bio.spawn(dna.Cell, {
        x: 40,
        y: 40,
        r: 15,
    }))

    hero.attach( lab.sea.bio.spawn(dna.Cell, {
        x: 75,
        y: 75,
        r: 10,
    }))

    lab.sea.follow(hero.head, true)

    /*
    hero.attach( lab.sea.bio.spawn(dna.Cell, {
        x: 90,
        y: 90,
        r: 10,
    }))
    */
}
