function keyUp(e) {
    switch(e.code) {
        case 'ArrowLeft':  lab.control.deactivate(1); break;
        case 'ArrowUp':    lab.control.deactivate(2); break;
        case 'ArrowRight': lab.control.deactivate(3); break;
        case 'ArrowDown':  lab.control.deactivate(4); break;
    }
}
