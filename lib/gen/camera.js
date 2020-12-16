function camera() {
    //lab.background = '#000000'
    lab.spawn('SlideCamera', {
        name: 'sea',
        x: 0,
        y: 0,
        zoomOnPlusMinus: true,
        speed: env.tune.cameraSpeed,
        targetingPrecision: 200,

        pin: function(target) {
            this.follow(target.head, true)
            this.hero = target
            lab.control.bind(target)
            //this.lookAt(target.head.x, target.head.y)
        },

        jumpNext: function() {
            let i = 0
            if (this.hero) i = this.tie._ls.indexOf(this.hero)

            let next
            do {
                const t = this.tie._ls[++i]
                if (t && !t.dead) next = t
            } while (!next && i < this.tie._ls.length - 1)

            if (!next && this.hero) {
                i = 0
                do {
                    const t = this.tie._ls[i++]
                    if (t && !t.dead) next = t
                } while (!next && i < this.tie._ls.length)
            }

            if (next) {
                this.pin(next)
            }
        },

        jumpPrev: function() {
            let i = this.tie._ls.length
            if (this.hero) i = this.tie._ls.indexOf(this.hero)

            let next
            do {
                const t = this.tie._ls[--i]
                if (t && !t.dead) next = t
            } while (!next && i > 0)

            if (!next && this.hero) {
                i = this.tie._ls.length
                do {
                    const t = this.tie._ls[--i]
                    if (t && !t.dead) next = t
                } while (!next && i > 0)
            }

            if (next) {
                this.pin(next)
            }
        },

        release: function() {
            this.follow()
            this.hero = null
            lab.control.bind()
        },

        moveTo: function(x, y) {
            this.follow( lib.v2.create(x, y), false)
        },
    })
    _.bio = lab.sea.touch('bio')
    _.tie = lab.sea.touch('tie')
    _.fx  = lab.sea.touch('fx')
    lab.sea.spawn(dna.current)
    lab.sea.spawn(dna.collider)
}
