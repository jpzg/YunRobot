import socket

# test program to ensure the linino socket server works

s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(('localhost',5005))
print 'Connected'
s.send("Hello woooooorld!")
print s.recv(64)