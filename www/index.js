var socket; // WebSocket object
var host;
var buffer = new Array(); // Buffer for functions to be called on message received

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
    p2:new Motor(2),
    onMove:function (instance, event, pointer) {
        motor.p1.spd = instance.position.x;
        motor.p2.spd = instance.position.y;
    },
};
var motor_onMove = function (instance, event, pointer) {
    motor.p1.spd = instance.position.x;
    motor.p2.spd = instance.position.y;
    $('#display').text('X:' + instance.position.x + '  |  Y:' + instance.position.y);
}
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
    /*servo.drag = new Draggabilly($('#x-slider')[0], {
        axis: 'x',
        containment: '#x-slider-c'
    });*/
    motor.drag = new Draggabilly($('#motor-slider')[0], {
        containment: '#motor-container'
    });
    //servo.on('dragMove', servo_onMove);
    motor.drag.on('dragMove', motor_onMove);
    $('')
});
