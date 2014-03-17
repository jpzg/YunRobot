import socket
from pyfirmata import Arduino, util

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('192.168.2.120', 3146))
s.listen(1);

board = Arduino('/dev/tty0')

while True:
	conn, addr = s.accept()
	print "Connection accepted",addr
	while True:
		try:
			data = conn.recv(64)
		except Exception:
			break
		if not data: break
		# Parse command here or maybe just use 'exec' to run it if the app sends complete, valid lines of code instead of 'command:pin:value' or something.
	conn.close()
	print "Connection closed"
