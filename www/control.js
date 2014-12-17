var c;
var _pointerDown = function (evt) {
    _pointerMove({
        originalEvent: {
            clientX: evt.originalEvent.clientX,
            clientY: evt.originalEvent.clientY,
            pressure: 1
        }
    });
    $('#handle').show();
}
var _pointerUp = function (evt) {
    $('#handle').hide();
}
var _pointerMove = function (evt) {
    e = evt.originalEvent;
    // Only move it if mouse/touch/pen is dragging
    if (e.pressure > 0) {
        var x = e.clientX;
        var y = e.clientY;
        var size_x = $('#handle').outerWidth();
        var size_y = $('#handle').outerHeight(); // Keep it within the container
        x = (x + size_x > c.x2) ? c.x2 - size_x : (x < c.x1) ? c.x1 : x;
        y = (y + size_y > c.y2) ? c.y2 - size_y : (y < c.y1) ? c.y1 : y;
		x2 = x * Math.cos(225) - y * Math.sin(225); // Output points are rotated 225 degrees so control is easier, x and y stay the same
		y2 = y * Math.sin(225) + x * Math.cos(225);
        $('#handle').css({ // Move it
            'top': y,
            'left': x
        });
        //x = Math.round((c.sx * (x - c.x1 + size_x)) - 134.5);
        //y = Math.round((c.sy * (y - c.y1 + size_y)) - 134.5); // Local container coords, mapped 0-255
        $('#display').text(x2 + ':' + y2); // Display localized position
    }
}
$(document).ready(function () {
    // Store positional data about container and its size
    var offset = $('#container').offset();
    c = new Object();
    c.x1 = offset.left;
    c.y1 = offset.top;
    c.x2 = offset.left + $('#container').outerWidth();
    c.y2 = offset.top + $('#container').outerHeight();
    // For mapping local container coordinates to 0-255
    c.sx = 255 / $('#container').outerWidth();
    c.sy = 255 / $('#container').outerHeight();
    // Bind pointer events
    $('#container').on('pointerdown', _pointerDown);
    $(document).on('pointerup', _pointerUp);
    $(document).on('pointermove', _pointerMove);

    $('#handle').hide();

    // Add a draggabilly, just to show how to make one
    var drag = new Draggabilly($('#drag')[0], {
        'containment': '#container'
    });
});