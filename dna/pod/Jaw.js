class Jaw {

    onInstall() {
    }

    evo(dt) {}

    draw() {
        const head = this.__
        const critter = this.__.parent
        if (!critter) {
            head.uninstallPod(this)
            return
        }

        const x = 0
        const y = 0
        const r = head.r

        const width = critter.jawWidth
        const opening = critter.jawOpen/2 * critter.jawRate
        const j1 = critter.fi - width - opening
        const w1 = j1 + width 
        const j2 = critter.fi + opening
        const w2 = j2 + width

        lineWidth(2)
        stroke( lib.util.teamColor(head.team) )
        arc(x, y, r + 4, j1, w1)
        arc(x, y, r + 4, j2, w2)
    }
}
