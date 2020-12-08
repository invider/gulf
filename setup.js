function setup() {
    //lab.background = hsl(.55, .2, .2)
    lab.background = hsl(.54, .4, .08)
    ctx.lineCap = 'round'

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

    // pin the camera to the hero's head
    lab.sea.follow(hero.head, true)
    lab.sea.hero = hero

    /*
    hero.attach( lab.sea.bio.spawn(dna.Cell, {
        x: 90,
        y: 90,
        r: 10,
    }))
    */
}
