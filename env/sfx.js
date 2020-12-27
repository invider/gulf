const GLOBAL = 0
const LOCAL = 1
const PERSONAL = 2

module.exports = {
    GLOBAL: GLOBAL,
    LOCAL: LOCAL,
    PERSONAL: PERSONAL,

    hit: {
        scope: LOCAL,
        res: 'bubble2',
        vol: .4,
    },
    eat: {
        scope: LOCAL,
        res: 'bubble2',
        vol: .3,
    },
    default: {
        scope: GLOBAL,
        res: 'bubble2',
        vol: .4,
    },
}
