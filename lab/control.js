
let target
const actions = []

function bind(t) {
    target = t
}

function activate(id) {
    if (!target) return
    actions[id] = true
    target.activate(id)
}

function deactivate(id) {
    if (!target) return
    actions[id] = false
}

function setTarget(x, y) {
    if (!target) return
    if (target.moveTo) target.moveTo(x, y)
}

function evo(dt) {
    if (!target) return
    for (let i = 0; i < actions.length; i++) {
        if (actions[i]) target.act(i, dt)
    }
}

