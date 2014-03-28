import re
from pyfirmata import Arduino, util
from tornado import websocket, web, ioloop

cl = []
class SocketHandler(websocket.WebSocketHandler):

    def open(self):
        if self not in cl:
            cl.append(self)
            print "Client connected:",self
    def on_message(self, message):
        print "Message from client: " + message
    def on_close(self):
        cl.remove(self)
        print "Client disconnected:",self

app = web.Application([(r'/ws', SocketHandler)])
if __name__ == '__main__':
    app.listen(3147)
    ioloop.IOLoop.instance().start()

#board = Arduino('/dev/ttyATH0', baudrate=115200)
#pin = [None] * 14
#p = re.compile(r'\d')

#while True:
#	while True:
#		try:
#			if "board.get_pin" in data: # Handle the get_pin command
#				pin[int(p.findall(data)[0])] = eval(data)
#			else:
#				value = eval(data) # Handle all other commands
#			print "Executed command : " + data
#			if(value): # Send any output from the command back through the socket

#				print "Command returned value: " + str(value)
#				value = None
#		except Exception,e:
#			print "Error while running command."
#			print e
