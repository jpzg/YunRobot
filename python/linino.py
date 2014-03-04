import socket
import sys
sys.path.insert(0, '/usr/lib/python2.7/bridge/')
from bridgeclient import BridgeClient as bridgeclient
from mailbox import Mailbox as mailbox

bridge = bridgeclient()
mail = mailbox()
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('192.168.2.120', 3146))
s.listen(1);

while True:
	conn, addr = s.accept()
	print "Connection accepted",addr
	while True:
		try:
			data = conn.recv(64)
		except Exception:
			break
		if not data: break
		mail.send(data)
		print data
	conn.close()
	print "Connection closed"
