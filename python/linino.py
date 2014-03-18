import socket
from pyfirmata import Arduino, util

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('192.168.1.9', 3146))
s.listen(1);

board = Arduino('/dev/ttyATH0', baudrate=57600)

while True:
	conn, addr = s.accept()
	print "Connection accepted",addr
	while True:
		try:
			data = conn.recv(64)
		except Exception:
			break
		if not data: break
		try:
			exec data
			print "Executed command : " + data + " from " + addr[0]
		except:
			print "Error while running command from " + addr[0]
			print "Command: " + data
	conn.close()
	print "Connection closed"
