var socket; // WebSocket object
var host;
var role;
var drag_pos = 0;
var buffer = new Array(); // Buffer for functions to be called on message received

// Function for executing Yun commands that return a value.
var get = function (msg, f, o) {
    socket.send(msg); // o is caller object. Defaults to document
    if (!o) { o = document; }
    buffer.push(function (s) { f.call(o, s) });
}

// Update table of pin info
var updatePins = function (info) {
    var sel = $('#digital > tbody tr');
    for (var i = 2; i < sel.length; i++) {
        var sel2 = sel[i].select('td');
        sel2[1] = info[i].mode;
		sel2[2] = info[i].type;
		sel2[3] = info[i].value;
    }
}
var setServo = function () {
    socket.send('yun.digital[9].write(' + drag_pos + ')');
}
var servo_onMove = function (instance, event, pointer) {
    $('#pos').text(instance.position.x * (160 / 255));
    drag_pos = instance.position.x * (160 / 255);
}
var disableTab = function(selection){
	$(selection).attr('data-toggle','javascript:null(0)');
	$(selection).parent().addClass('disabled');
}
var enableTab = function(selection){
	$(selection).attr('data-toggle','tab');
	$(selection).parent().removeClass('disabled');
}
$(function () {
	// Determine robot IP and open socket
    if (!window.location.host) { host = '192.168.2.120';}
    else { host = window.location.host }
	$('#nav-title').text('Robot @ ' + host);
    socket = new WebSocket('ws://' + host + ':3146/ws');
    socket.onopen = function (evt) {
        $('#conn-status').removeClass('alert-warning').addClass('alert-success').text('Connected');
        //updatePins.timer = window.setInterval(updatePins, 1000);
        setServo.interval = window.setInterval(setServo, 25);
    }
    socket.onmessage = function (evt) {
		obj = JSON.parse(evt.data.substr(5));
		switch(obj.type){
			case 'event.closeRole':
				disableLink('#tabs a[href="#' + obj.data + '"]');
				break
			case 'event.openRole':
				enableLink('#tabs a[href+"#' + obj.data + '"]');
				break
			default:
				buffer.pop().call(document, evt.data); // pops a function off the buffer and runs it with the received value as an arg
				break
		}
    }
    socket.onerror = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-danger').text('Socket Error');
    }
    socket.onclose = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-warning').text('Socket Closed');
        window.clearInterval(updatePins.timer);
        window.clearInterval(setServo.interval);
    }

	// Create draggable object for servo slider and attach movement event handler
    var servo = new Draggabilly($('#x-slider')[0], {
        axis: 'x',
        containment: '#x-slider-c'
    });
    servo.on('dragMove', servo_onMove);
});

