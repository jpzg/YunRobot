var socket; // WebSocket object
var buffer = new Array(); // Buffer for functions to be called on message received

var get = function(msg,f,o){ // Function for executing Yun commands that return a value.
	socket.send(msg); // o is defaults to document but neccessary for console.log or similar
	if(!o){ o = document; }
	buffer.push(function(s){f.call(o,s)});
}
var updatePins = function(){
	$('#digital > tbody tr').each(function(index) {
		$(this).select('td').each(function(index2){
			var cmd;
			switch(index2){
				case 1:
					cmd = 'yun.digital[' + (index + 2) + '].type';
					break
				case 2:
					cmd = 'yun.digital[' + (index + 2) + '].mode';
					break
				case 3:
					cmd = 'yun.digital[' + (index + 2) + '].read()';
					break
				$(this).text(get(cmd));
			}
		});
    });
}
$(function(){
	$('#nav-title').text('Robot @ '+ window.location.host);
	//socket = new WebSocket('ws://' + window.location.host + ':3146/ws');
	socket = new WebSocket('ws://192.168.2.120:3146/ws'); // Just for testing
	socket.onopen = function(evt){
		$('#conn-status').removeClass('alert-warning').addClass('alert-success').text('Connected');
		updatePins.timer = window.setInterval(updatePins,1000);
		socket.send('yun.digital[13].write(1)');
		//get('yun.digital[13].read()',console.log,console);
		setTimeout(function(){socket.send('yun.digital[13].write(0)')},5000);
	}
	socket.onmessage = function(evt){
		buffer.pop().call(document,evt.data); // pops a function off the buffer and runs it with the received value as an arg
	}
	socket.onerror = function(evt){
		$('#conn-status').removeClass('alert-success').addClass('alert-danger').text('Socket Error');
	}
	socket.onclose = function(evt){
		$('#conn-status').removeClass('alert-success').addClass('alert-warning').text('Socket Closed');
		window.clearInterval(updatePins.timer);
	}
	for(var i = 0;i<14;i++){
		$('#digital > tbody').append('<tr><td>' + i + '</td><td></td><td></td><td></td></tr>');
	}
	for(var i = 0;i<6;i++){
		$('#analog > tbody').append('<tr><td>' + i + '</td><td></td><td></td><td></td></tr>');
	}
});

