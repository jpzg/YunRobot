var socket;
var console;
var buffer = new Array();
$(function(){
	$('#nav-title').text('Robot @ '+ window.location.host);
	//socket = new WebSocket('ws://' + window.location.host + ':3146');
	socket = new WebSocket('ws://192.168.2.120:3146/ws'); // Just for testing
	socket.onopen = function(evt){
		alert('socket open');
		socket.send('5*5');
	}
	socket.onmessage = function(evt){
		buffer.push(evt.data);
		alert(evt.data);
	}
	for(var i = 0;i<14;i++){
		$('#digital > tbody').append('<tr><td>' + i + '</td></tr>');
	}
	for(var i = 0;i<6;i++){
		$('#analog > tbody').append('<tr><td>' + i + '</td></tr>');
	}
	socket.send('len(yun.digital)');
});

