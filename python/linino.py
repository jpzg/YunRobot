import socket
import imp
mailbox = imp.load_source('bridge','/usr/lib/python2.7/bridge/mailbox.py')
#test = imp.load_source('test','moduletest.py')
#test.greeting();

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 5005))
s.listen(1);

while True:
	conn, addr = s.accept()
	while True:
		data = conn.recv(64)
		if not data: break
		mailbox.send(data)
	conn.close()
