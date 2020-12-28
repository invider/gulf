const GLOBAL = 0
const LOCAL = 1
const PERSONAL = 2

module.exports = {
    GLOBAL: GLOBAL,
    LOCAL: LOCAL,
    PERSONAL: PERSONAL,

    born: {
        scope: LOCAL,
        res: 'underwaterPass',
        vol: 1,
    },
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
    grow: {
        scope: PERSONAL,
        res: 'pop',
        vol: .8,
    },
    death: {
        scope: LOCAL,
        res: 'organicKlik',
        vol: .8,
    },

    target: {
        scope: GLOBAL,
        res: 'item',
        vol: .4,
    },
    default: {
        scope: GLOBAL,
        res: 'bubble2',
        vol: .4,
    },
}
