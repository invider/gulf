const info = {
    init: function() {
        env.statusInfo = {}
    },
    evo: function(dt) {
        env.statusInfo.bio = lab.sea.bio._ls.length
        env.statusInfo.tie = lab.sea.tie._ls.length
    },
}
