from pyfirmata import Arduino, util
from tornado import websocket, web, ioloop
import json

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

yun = Arduino('/dev/ttyATH0', baudrate=115200)

cl = {'drive':None,'attachment':None} # Dict of roles, clients who fill them are put in under that index
ncl = [] # Array of clients without roles, e.g.  any who are just looking at info.
def removeClient(client): # Remove client from ncl if present, before looking through roles
    if client in ncl:
        ncl.remove(client)
        return 1
    else:
        for k,v in cl.iteritems():
            if v == client:
                cl[k] = None
                return 2,k
    return -1

def broadcast(data): # Broadcast a single message to clients.  Pin updates, role openings, etc.
    message = json.dumps(data);
    for client in ncl:
        client.write_message(message)
    for client in cl.values():
        if client:
            client.write_message(message)

### Class to handle websocket connections
class SocketHandler(websocket.WebSocketHandler):

    def open(self): # Add new client to dict of roles or array of role-less clients
        if self not in ncl and self not in cl.values():
            ncl.append(self)
            print "[INFO] New connection:", self.request.remote_ip  
    def on_message(self, message): # Execute received message as python code and send back any returned value,
        obj = json.loads(message)
        if obj['type'] == 'event.switchRole': # Switch client role
            result,role = removeClient(self)
            if obj['data'] != 'null':
                cl[obj['data']] = self
                broadcast(json.dumps({'type':'event.closeRole', 'data':obj['data']}))
            else:
                ncl.append(self)
            if result == 2:
                broadcast(json.dumps({'type':'event.openRole','data':role}))
            print '[EVT]', self.request.remote_ip + ' switched roles to ' + obj['data']
        if obj['type'] == 'command':
            print '[CMD]', obj, self.request.remote_ip
            value = eval(message)
            if value != None:
                print value
                self.write_message(json.dumps({'type':'value','data':value}))
    def on_close(self): # Remove client
        removeClient(self)
        print "[INFO] Client disconnected:", self.request.remote_ip

app = web.Application([(r'/ws', SocketHandler)])
if __name__ == '__main__':
    app.listen(3146)
    ioloop.IOLoop.instance().start()
