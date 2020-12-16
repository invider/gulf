function keyDown(e) {
    if (e.repeat) return
    switch(e.code) {
        case 'Escape': lab.sea.release(); break;
        case 'Tab':    lab.sea.jumpNext(); break;
        case 'Backspace': lab.sea.jumpPrev(); break;

        case 'ArrowLeft':  lab.control.activate(1); break;
        case 'ArrowUp':    lab.control.activate(2); break;
        case 'ArrowRight': lab.control.activate(3); break;
        case 'ArrowDown':  lab.control.activate(4); break;
    }
}
