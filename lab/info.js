const info = {
    init: function() {
        env.statusInfo = {}
    },
    evo: function(dt) {
        env.statusInfo.bio = lab.sea.bio._ls.length
    },
}
