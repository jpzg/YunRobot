var socket;
var console;
var buffer = new Array();

var get = function(s){
	socket.send(s);
	return buffer.pop();
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
	//socket = new WebSocket('ws://' + window.location.host + ':3146');
	socket = new WebSocket('ws://192.168.2.120:3146/ws'); // Just for testing
	socket.onopen = function(evt){
		$('#conn-status').removeClass('alert-warning').addClass('alert-success').text('Connected');
		updatePins.timer = window.setInterval(updatePins,1000);
		socket.send('yun.digital[13].write(1)');
		console.log(get('yun.digital[13].read()'));
	}
	socket.onmessage = function(evt){
		buffer.push(evt.data);
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

