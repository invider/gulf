function camera() {
    //lab.background = '#000000'
    lab.spawn('SlideCamera', {
        name: 'sea',
        x: 0,
        y: 0,
        zoomOnPlusMinus: true,
        speed: env.tune.cameraSpeed,
        targetingPrecision: 200,
    })
    _.bio = lab.sea.touch('bio')
    _.tie = lab.sea.touch('tie')
    _.fx  = lab.sea.touch('fx')
    lab.sea.spawn(dna.collider)
}
