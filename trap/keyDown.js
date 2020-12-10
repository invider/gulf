function keyDown(e) {
    if (e.repeat) return
    switch(e.code) {
        case 'ArrowLeft':  lab.control.activate(1); break;
        case 'ArrowUp':    lab.control.activate(2); break;
        case 'ArrowRight': lab.control.activate(3); break;
        case 'ArrowDown':  lab.control.activate(4); break;
    }
}
