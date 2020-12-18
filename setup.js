function setup() {
    //lab.background = hsl(.55, .2, .2)
    lab.background = hsl(.54, .4, .08)
    ctx.lineCap = 'round'

    lib.gen.camera()

    trap('critter', {
        team: 2,
        name: 'hero',
        x: 120,
        y: 120,
    })

    // pin the camera to the hero's head
    const hero = lab.sea.tie.hero
    lab.sea.pin(hero)
    /*
    lab.sea.follow(hero.head, true)
    lab.sea.hero = hero
    lab.control.bind(hero)
    */

    // spawn some food
    trap('source')
    trap('source')
    trap('source')

}
