module.exports = function() {

    setTimeout(() => {
        const team = 1
        if (env.stat.population(team) > env.tune.maxPopulation) return
        trap('critter', {
            team: team,
            x: -300,
        })
    }, RND(1, 15))

    setTimeout(() => {
        const team = 2
        if (env.stat.population(team) > env.tune.maxPopulation) return
        trap('critter', {
            team: team,
            x: 300,
        })
    }, RND(1, 15))
}
