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

        drawList: function(ls, vp) {
            let i = 0
            ls.forEach( e => {
                if (e.draw && !e.dead) {
                    // culling
                    if (e._sizable) {
                        if ((e._centered
                                    && e.x+e.w/2 >= vp[0]
                                    && e.x-e.w/2 <= vp[2]
                                    && e.y+e.h/2 >= vp[1]
                                    && e.y-e.h/2 <= vp[3])
                                || (e.x+e.w >= vp[0]
                                    && e.x  <= vp[2]
                                    && e.y+e.h >= vp[1]
                                    && e.y  <= vp[3])) {
                            e.draw()
                            i++
                        }
                    } else if (e._circular) {
                        if (e.x+e.r >= vp[0]
                                && e.x-e.r <= vp[2]
                                && e.y+e.r >= vp[1]
                                && e.y-e.r <= vp[3]) {
                            e.draw()
                            i++
                        }

                    } else {
                        e.draw()
                        i++
                    }
                }
            })
            return i
        },

        draw: function() {
            save()
            let sw = env.width
            let sh = env.height
            let vp = this.getViewport()
            
            ctx.translate(sw/2, sh/2) // half-screen shift
            ctx.scale(this.scale, this.scale);
            ctx.translate(-this.x, -this.y)

            //this.drawList(this._ls)
            let i = 0
            this.current.draw()
            i += this.drawList(this.bio._ls, vp)
            i += this.drawList(this.tie._ls, vp)
            i += this.drawList(this.fx._ls, vp)
            env.statusInfo.rendered = i

            /*
            // draw viewport
            ctx.strokeStyle = '#ff0000'
            ctx.strokeRect(vp[0], vp[1], vp[2]-vp[0], vp[3]-vp[1])
            */
            restore()
        },

    })
    _.bio = lab.sea.touch('bio')
    _.tie = lab.sea.touch('tie')
    _.fx  = lab.sea.touch('fx')
    lab.sea.spawn(dna.current)
    lab.sea.spawn(dna.collider)
}
