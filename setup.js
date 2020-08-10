function setup() {
    lab.spawn('SlideCamera', {
        name: 'sea',
        x: 0,
        y: 0,
        zoomOnPlusMinus: true,
    })
    _.bio = lab.sea.touch('bio')
    _.tie = lab.sea.touch('tie')
    _.fx  = lab.sea.touch('fx')
    lab.sea.spawn(dna.collider)

    trap('source')
    trap('source')
    trap('source')

    const hero = lab.sea.tie.spawn(dna.Critter, {
        team: 1,
        name: 'hero',
    })
    const head = lab.sea.bio.spawn(dna.Cell, {
        team: 1,
        x: 50,
        y: 50,
        r: 10,
    })
    hero.attach(head)
}
