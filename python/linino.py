import socket
import imp
#bridge = imp.load_source('bridge','/usr/lib/python2.7/bridge/bridgeclient.py')
test = imp.load_source('test','moduletest.py')
test.greeting();

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 5005))
s.listen(1);

conn, addr = s.accept()
print 'Connection address:',addr
while True:
    data = conn.recv(64)
    if not data: break
    print "recieved data:",data
    conn.send("a;lsdjf you")
conn.close()
