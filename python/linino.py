from pyfirmata import Arduino, util
from tornado import websocket, web, ioloop

### Values for pin types
INPUT = 0
OUTPUT = 1
ANALOG = 2
PWM = 3
SERVO = 4

### Values for motor direction
FORWARD = 1
BACKWARD = 2
BRAKE = None # These don't work.
RELEASE = None

clients = []

yun = Arduino('/dev/ttyATH0', baudrate=115200)
s = yun.get_shield()
m1 = s.get_motor(1)
m2 = s.get_motor(3)
m1.dir, m2.dir = FORWARD, FORWARD
m1.spd, m2.spd = 0,0

def retrieve(client,value):
    client.send(value)

### Class to handle websocket connections
class SocketHandler(websocket.WebSocketHandler):

    def open(self): # Add new client to dict of roles or array of role-less clients
        if self not in clients:
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
