from pyfirmata import Arduino, util
from tornado import websocket, web, ioloop

### Values for pin types
INPUT = 0
OUTPUT = 1
ANALOG = 2
PWM = 3
SERVO = 4

### Values for motor direction
FORWARD = 0
BACKWARD = 1
BRAKE = 2
RELEASE = 3

clients = []

yun = Arduino('/dev/ttyATH0', baudrate=115200)
s = yun.get_shield()
m = s.getMotor(1)
m.run(FORWARD)

def retrieve(client,value):
    client.send(value)

### Class to handle websocket connections
class SocketHandler(websocket.WebSocketHandler):

    def open(self): # Add new client to dict of roles or array of role-less clients
        if self not in ncl and self not in cl.values():
            clients.append(self)
            print "[INFO] New connection:", self.request.remote_ip
              
    def on_message(self, message): # Execute received message using exec()
            print '[CMD]', message, self.request.remote_ip
            exec message

    def on_close(self): # Remove client
        clients.remove(self)
        print "[INFO] Client disconnected:", self.request.remote_ip

app = web.Application([(r'/ws', SocketHandler)])
if __name__ == '__main__':
    app.listen(3146)
    ioloop.IOLoop.instance().start()
