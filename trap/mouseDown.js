function mouseDown(e) {
    if (!lab.sea.tie.hero) return

    const lx = lab.sea.lx(mouse.x)
    const ly = lab.sea.ly(mouse.y)
    //log('click at: ' + mouse.x + 'x' + mouse.y)
    //log('TARGET AT: ' + lx + 'x' + ly)

    lab.sea.tie.hero.moveTo(lx, ly)
}
