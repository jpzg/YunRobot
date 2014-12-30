var c;
var socket;
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
        x -= c.x1;
        y -= c.y1;
        x2 = x - $('#container').outerWidth() / 2;
        y2 = y - $('#container').outerHeight() / 2;
		//x2 = Math.round(x2 * Math.cos(225) - y2 * Math.sin(225)); // Output points are rotated 225 degrees so control is easier, x and y stay the same
		//y2 = Math.round(y2 * Math.sin(225) + x2 * Math.cos(225));
        $('#handle').css({ // Move it
            'top': y,
            'left': x
        });
        //x2 = Math.round(x2 * c.sx);
        //y2 = Math.round(y2 * c.sy); // Local container coords, mapped 0-255
        $('#display').text(x2 + '\t' + y2 + '\t' + x + '\t' + y + '\t' + c.x2 + '\t' + c.y2); // Display localized position
    }
}
$(document).ready(function () {
    socket = new WebSocket('ws://192.168.240.1:3146/ws');
    // Store positional data about container and its size
    var offset = $('#container').offset();
    c = new Object();
    c.x1 = offset.left; // x1 and y1 are the top left corner
    c.y1 = offset.top; // x2 and y2 are the bottom right corner
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
});