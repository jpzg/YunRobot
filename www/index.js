var socket; // WebSocket object
var host;
var buffer = new Array(); // Buffer for functions to be called on message received
var c; // Object to hold position data about motor drag container

var get = function (msg, f, o) { // Execute any Yun method which returns a value
    socket.send(msg); // o is caller object. Defaults to document
    if (!o) { o = document; }
    buffer.push(function (s) { f.call(o, s) });
}
var Motor = function(port){
    this.port = port;
    this._dir = 0;
    this._spd = 0;
    this.__defineGetter__("dir",function(){
        return this._dir;
    });
    this.__defineSetter__("dir",function(dir){
        socket.send('m' + this.port + '.dir =' + dir);
        this._dir = dir;
    });
    this.__defineGetter__("spd",function(){
        return this._spd;
    });
    this.__defineSetter__("spd", function (spd) {
        spd = (spd < 0) ? 0 : Math.round(spd);
        if (spd != this._spd) {
            socket.send('m' + this.port + '.spd = ' + spd);
            this._spd = spd;
        }
    });
};
var motor = {
    p1:new Motor(1),
    p2:new Motor(2)
};
var servo = new Object();
var setServo = function () {
    if (setServo.pos < 0) { setServo.pos = 0;}
    if (setServo.pos != setServo.prev) {
        socket.send('yun.digital[9].write(' + setServo.pos + ')');
        setServo.prev = setServo.pos;
    }
}

var servo_onMove = function (instance, event, pointer) {
    $('#pos').text(instance.position.x * (160 / 255));
    setServo.pos = instance.position.x * (160 / 255);
}
var connect = function (ip) {
    $('#nav-title').text('Robot @ ' + ip);
    socket = new WebSocket('ws://' + ip + ':3146/ws');
    socket.onmessage = function (evt) {
        buffer.pop().call(document, evt.data); // pops a function off the buffer and runs it with the received value as an arg
    }
    socket.onerror = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-danger').text('Socket Error');
    }
    socket.onclose = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-warning').text('Socket Closed');
    }
    return socket;
}

var _pointerDown = function (evt) {
    _pointerMove({
        originalEvent: {
            clientX: evt.originalEvent.clientX,
            clientY: evt.originalEvent.clientY,
            pressure: 1
        }
    });
    $('#motor-slider').show();
}
var _pointerUp = function (evt) {
    $('#motor-slider').hide();
}
var _pointerMove = function (evt) {
    e = evt.originalEvent;
    // Only move it if mouse/touch/pen is dragging
    if (e.pressure > 0) {
        var x = e.clientX;
        var y = e.clientY;
        var size_x = $('#motor-slider').outerWidth();
        var size_y = $('#motor-slider').outerHeight(); // Keep it within the container
        x = (x + size_x > c.x2) ? c.x2 - size_x : (x < c.x1) ? c.x1 : x;
        y = (y + size_y > c.y2) ? c.y2 - size_y : (y < c.y1) ? c.y1 : y;
        $('#motor-slider').css({ // Move it
            'top': y,
            'left': x
        });
        x = Math.round(c.sx * (x - c.x1 + size_x));
        y = Math.round(c.sy * (y - c.y1 + size_y)); // Local container coords, mapped 0-255
        motor.p1.spd = x;
        motor.p2.spd = y;
        $('#display').text(x + ':' + y); // Display localized position
    }
}

$(function () {
	// Determine robot IP and open socket
    //if (!window.location.host) { host = prompt('What is the robot IP?'); }
    //else { host = window.location.host; }
    host = '192.168.1.254';
	var socket = connect(host);
    socket.onopen = function (evt) {
        $('#conn-status').removeClass('alert-warning').addClass('alert-success').text('Connected');
    }

	// Create draggable object for servo slider and attach movement event handler
    /*
    servo.drag = new Draggabilly($('#x-slider')[0], {
        axis: 'x',
        containment: '#x-slider-c'
    });
    servo.on('dragMove', servo_onMove);
    */
    // Store positional data about container and its size
    var offset = $('#motor-container').offset();
    c = new Object();
    c.x1 = offset.left;
    c.y1 = offset.top;
    c.x2 = offset.left + $('#motor-container').outerWidth();
    c.y2 = offset.top + $('#motor-container').outerHeight();
    // For mapping local container coordinates to 0-255
    c.sx = 255 / $('#motor-container').outerWidth();
    c.sy = 255 / $('#motor-container').outerHeight();
    // Bind pointer events
    $('#motor-container').on('pointerdown', _pointerDown);
    $(document).on('pointerup', _pointerUp);
    $(document).on('pointermove', _pointerMove);

    $('#motor-slider').hide();
});
