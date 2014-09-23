var socket; // WebSocket object
var host;
var buffer = new Array(); // Buffer for functions to be called on message received

var arduino = function (ip, port) {
    this.ip = ip;
    this.port = port;
    this.address = ip + ":" + port;
    this.socket = WebSocket('ws://' + this.address + '/');
    this.servoConfig = function(pin){
        this.pin = pin;
        this.socket.send("yun.servo_config(" + this.address + ")");
        this.__defineGetter__("position",new function(position){
            this.socket.send("yun.digital[" + pin + "].write(" + position + ")");
        });
    }
}

var get = function (msg, f, o) { // Execute any Yun method which returns a value
    socket.send(msg); // o is caller object. Defaults to document
    if (!o) { o = document; }
    buffer.push(function (s) { f.call(o, s) });
}
var setServo = function () {
    socket.send('yun.digital[9].write(' + servo.pos + ')');
}
var setMotor = function () {
    socket.send('m.setSpeed(' + motor.pos + ')');
}
var servo_onMove = function (instance, event, pointer) {
    $('#pos').text(instance.position.x * (160 / 255));
    servo.pos = instance.position.x * (160 / 255);
}
var motor_onMove = function (instance, event, pointer) {
    $('#pos2').text(instance.position.y);
    motor.pos = instance.position.y;
}
var connect = function (ip) {
    host = ip
    $('#nav-title').text('Robot @ ' + host);
    socket = new WebSocket('ws://' + host + ':3146/ws');
    socket.onmessage = function (evt) {
            buffer.pop().call(document, evt.data); // pops a function off the buffer and runs it with the received value as an arg
        }
    }
    socket.onerror = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-danger').text('Socket Error');
    }
    socket.onclose = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-warning').text('Socket Closed');
        window.clearInterval(setServo.interval);
        window.clearInterval(setMotor.interval);
    }

$(function () {
	// Determine robot IP and open socket
    //if (!window.location.host) { host = prompt('What is the robot IP?'); }
    //else { host = window.location.host; }
    host = '192.168.1.13';
	connect(host);
    socket.onopen = function (evt) {
        $('#conn-status').removeClass('alert-warning').addClass('alert-success').text('Connected');
        setServo.interval = window.setInterval(setServo, 25);
        setMotor.interval = window.setInterval(setMotor, 100);
    }

	// Create draggable object for servo slider and attach movement event handler
    var servo = new Draggabilly($('#x-slider')[0], {
        axis: 'x',
        containment: '#x-slider-c'
    });
    var motor = new Draggabilly($('#y-slider')[0], {
        axis: 'y',
        containment: '#y-slider-c'
    });
    servo.on('dragMove', servo_onMove);
    motor.on('dragMove', motor_onMove);
});
