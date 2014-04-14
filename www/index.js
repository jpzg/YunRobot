var socket; // WebSocket object
var host;
var drag_pos = 0;
var buffer = new Array(); // Buffer for functions to be called on message received

var get = function (msg, f, o) { // Function for executing Yun commands that return a value.
    socket.send(msg); // o is defaults to document but neccessary for console.log or similar
    if (!o) { o = document; }
    buffer.push(function (s) { f.call(o, s) });
}
var updatePins = function () {
    var sel = $('#digital > tbody tr');
    for (var i = 0; i < sel.length; i++) {
        var sel2 = sel[i].select('td');
        for (var n = 0; n < sel2.length; n++) {
            var cmd;
            switch (n) {
                case 1:
                    cmd = 'yun.digital[' + (i) + '].type';
                    break
                case 2:
                    cmd = 'yun.digital[' + (i) + '].mode';
                    break
                case 3:
                    cmd = 'yun.digital[' + (i) + '].read()';
                    break
                    get(cmd, text, this);
            }
        }
    }
}
var setServo = function () {
    socket.send('yun.digital[9].write(' + drag_pos + ')');
}
var servo_onMove = function (instance, event, pointer) {
    $('#pos').text(instance.position.x * (160 / 255));
    drag_pos = instance.position.x * (160 / 255);
}

$(function () {
    $('#nav-title').text('Robot @ ' + window.location.host);

    if (!window.location.host) { host = 'ws://192.168.2.120:3146/ws';}
    else { host = 'ws://' + window.location.host + ':3146/ws' }
    socket = new WebSocket(host);
    socket.onopen = function (evt) {
        $('#conn-status').removeClass('alert-warning').addClass('alert-success').text('Connected');
        //updatePins.timer = window.setInterval(updatePins, 1000);
        socket.send('yun.digital[13].write(1)');
        //get('yun.digital[13].read()',console.log,console);
        //setTimeout(function () { socket.send('yun.digital[13].write(0)') }, 5000);
        socket.send('yun.servo_config(9)');
        setServo.interval = window.setInterval(setServo, 25);
    }
    socket.onmessage = function (evt) {
        buffer.pop().call(document, evt.data); // pops a function off the buffer and runs it with the received value as an arg
    }
    socket.onerror = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-danger').text('Socket Error');
    }
    socket.onclose = function (evt) {
        $('#conn-status').removeClass('alert-success').addClass('alert-warning').text('Socket Closed');
        window.clearInterval(updatePins.timer);
        window.clearInterval(setServo.interval);
    }

    var servo = new Draggabilly(document.querySelector('#x-slider'), {
        axis: 'x',
        containment: '#x-slider-c'
    });
    servo.on('dragMove', servo_onMove);

    // Create tables of pin info
    //for (var i = 0; i < 14; i++) {
    //    $('#digital > tbody').append('<tr><td>' + i + '</td><td></td><td></td><td></td></tr>');
    //}
    //for (var i = 0; i < 6; i++) {
    //    $('#analog > tbody').append('<tr><td>' + i + '</td><td></td><td></td><td></td></tr>');
    //}
});

