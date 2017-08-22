function mouseMove(e) {
    // JS-style media query
    if (window.innerWidth < 1000) return;
    var btn = document.getElementById('button');
    // Ensures function doesn't throw error
    if (!btn) return;
    // Makes sure that this doesn't apply while loading, to indicate to user that the button can't be pressed
    if (btn.className.indexOf("animated") != -1) return;

    // Gets position of items and mouse
    var y = e.clientY;
    var bar = document.getElementById('buttonbar');
    var barpos = bar.getBoundingClientRect().top;
    var bodypos = document.getElementsByTagName('body')[0].getBoundingClientRect().top
    // Makes positions relative to the body instad of the viewport
    y = y - bodypos;
    barpos = barpos - bodypos;
    // Makes the distance between the mouse and bar into a percentage, to be applied to the width
    var percpos = y/barpos;
    
    // Percentage is 1 when mouse is the same height as the bar
    if (percpos <= 1) {
        var width = percpos;
    } else {
        // "Inverts" the decimal value, so when mouse moves below the bar the width changes
        var width = 2 - percpos;
    }
    // Squaring the width makes it more responsive, as it gets wider exponentially as the mouse gets closer to it
    width = width*width;
    // Applies the width to a value 190 - 255
    var bright = width*65;
    bright = bright+190;
    bright = bright.toFixed(0);
    // Converts width from decimal to percentage, and applies CSS properties
    width = width*100;
    bar.style.width = width+"%";
    btn.style.color = "rgb("+bright+","+bright+","+bright+")";
    bar.style.backgroundColor = "rgb("+bright+","+bright+","+bright+")";
}