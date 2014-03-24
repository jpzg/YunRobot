import socket
import re
from pyfirmata import Arduino, util

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

#s.bind(('192.168.240.1', 3146))
print('Enter ip address for command socket:')
s.bind((raw_input(),3146))
s.listen(1);
print('Socket created.')

board = Arduino('/dev/ttyATH0', baudrate=115200)
pin = [None]*14
p = re.compile(r'\d')

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
			if "board.get_pin" in data: # Handle the get_pin command
				pin[int(p.findall(data)[0])] = eval(data)
			else:
				value = eval(data) # Handle all other commands
			print "Executed command : " + data + " from " + addr[0]
			if(value): # Send any output from the command back through the socket
				conn.send(str(value) + "\n")
				print "Command returned value: " + str(value)
				value = None
		except Exception,e:
			print "Error while running command from " + addr[0]
			print e
	conn.close()
	print "Connection closed"
