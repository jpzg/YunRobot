var c;
var h;
var socket;
var onTick = { // Holds all messages to be sent on a tick
    spd: [],
    dir: [],
    serv1: null,
    serv2: null,
    misc: [],
}

var motor = function (port, speed) {
    if (speed < 0) { // Change direction based on speed positive/negative
        onTick.dir[port - 1] = 'm' + port + '.dir=2'; // May want to do something about always sending change direction signal
    }
    else {
        onTick.dir[port - 1] = 'm' + port + '.dir=1'
    }
    onTick.spd[port - 1] = 'm' + port + '.spd=' + Math.abs(speed);
}

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
    motor(1, 0);
    motor(2, 0);
}
var _pointerMove = function (evt) {
    e = evt.originalEvent;
    // Only move it if mouse/touch/pen is dragging
    if (e.pressure > 0) {
        var x = e.clientX;
        var y = e.clientY;
        // Keep it within the container
        x = (x + h.width > c.x2) ? c.x2 - h.width : (x < c.x1) ? c.x1 : x;
        y = (y + h.height > c.y2) ? c.y2 - h.height : (y < c.y1) ? c.y1 : y;
        x -= c.x1;
        y -= c.y1;
        x2 = x - (($('#container').outerWidth() - h.width) / 2);
        y2 = y - (($('#container').outerHeight() - h.height) / 2);
		//x2 = Math.round(x2 * Math.cos(225) - y2 * Math.sin(225)); // Output points are rotated 225 degrees so control is easier, x and y stay the same
		//y2 = Math.round(y2 * Math.sin(225) + x2 * Math.cos(225));
        $('#handle').css({ // Move it
            'top': y,
            'left': x
        });
        x2 = Math.round(x2 * c.sx);
        y2 = Math.round(y2 * c.sy); // Local container coords, mapped 0-255
        motor(1, x2);
        motor(1, y2);
        $('#display').text(x2 + '\t' + y2 + '\t' + x + '\t' + y + '\t' + c.x2 + '\t' + c.y2); // Display localized position
    }
}

var _tick = function (evt) {
    for (k in onTick) {
        if (typeof (onTick[k]) == 'object') {
            for (e in onTick[k]) {
                socket.send(onTick[k][e]);
            }
            onTick[k] = [];
            continue;
        }
        if (onTick[k]) {
            socket.send(onTick[k]);
            onTick[k] = null;
        }
    }
}
/*
var _butane_pointerDown = function (evt) {

}

var _butane_pointerUp = function (evt) {
    
}
*/
$(document).ready(function () {
    socket = new WebSocket('ws://192.168.240.1:3146/ws');
    socket.onopen = function (evt) { socket.send('m1.dir,m2.dir=1,1'); }
    // Store positional data about container and its size
    var offset = $('#container').offset();
    c = {
        x1: offset.left, // x1 and y1 are the top left corner
        y1: offset.top, // x2 and y2 are the bottom right corner
        x2: offset.left + $('#container').outerWidth(),
        y2: offset.top + $('#container').outerHeight(),
        // For scaling local container coordinates to +/- 255. Seems to get rounded somehow, max is +/- 242
        sx: 255 / $('#container').outerWidth() * 2,
        sy: 255 / $('#container').outerHeight() * 2
    }
    
    h = {
        width: $('#handle').outerWidth(),
        height: $('#handle').outerHeight()
    }

    // Bind pointer events
    $('#container').on('pointerdown', _pointerDown);
    $(document).on('pointerup', _pointerUp);
    $(document).on('pointermove', _pointerMove);
    //$('#butane').on('pointerdown', _butane_pointerDown);
    //$('#butane').on('pointerup', _butane_pointerUp);

    $('#handle').hide();
    var tick = setInterval(_tick, 100);
});