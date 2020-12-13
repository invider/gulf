let id = 0
function source() {
    lab.sea.bio.spawn(dna.Cell, {
        x: 0,
        y: 0,
        r: 10,
        dx: RND(40) - 20,
        dy: RND(20) - 10,
        lifespan: 30,
    })
}
