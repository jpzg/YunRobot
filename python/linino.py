import socket
from pyfirmata import Arduino, util

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('192.168.240.1', 3146))
s.listen(1);

board = Arduino('/dev/ttyATH0', baudrate=115200)

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
			value = eval(data)
			print "Executed command : " + data + " from " + addr[0]
			if(value):
				conn.send(str(value) + "\n")
				print "Command returned value: " + str(value)
		except Exception,e:
			print "Error while running command from " + addr[0]
			print e
	conn.close()
	print "Connection closed"
