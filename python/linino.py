from pyfirmata import Arduino, util
from tornado import websocket, web, ioloop

INPUT = 0
OUTPUT = 1
ANALOG = 2
PWM = 3
SERVO = 4

yun = Arduino('/dev/ttyATH0', baudrate=115200);

cl = []
pin = [None]*14
class SocketHandler(websocket.WebSocketHandler):

    def open(self):
        if self not in cl:
            cl.append(self)
            print "[INFO] New connection:", self.request.remote_ip
            
    def on_message(self, message):
        try:
            print '[CMD]', message
            value = eval(message)
            if value != None:
                print value
                self.write_message(str(value))
        except Exception,e:
            print '[ERROR]', e
            
    def on_close(self):
        cl.remove(self)
        print "[INFO] Client disconnected:", self.request.remote_ip

app = web.Application([(r'/ws', SocketHandler)])
if __name__ == '__main__':
    app.listen(3146)
    ioloop.IOLoop.instance().start()
