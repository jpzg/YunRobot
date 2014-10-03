YunRobot
========

<h3>Anyone who wants to help is welcome to.</h3>
If you find any of this code messy/confusing or want clarification on some part of the project, comment or email.

Arduino and python programs for arduino yun controlling a robot via wifi and Websockets, with a control webpage served by the Yun. Using a web interface means the best possible cross-compatibility, without anyone writing more than one app.
Currently, the arduino is nothing but the slave of the linux processor, which does barely more than pass commands from the websocket connection to the arduino. Later, it may have some autonomy.

This project essentially has four parts: hardware, arduino software, linux software, and a webpage.
Hardware CAD files are available from http://jpzg.github.io/YunRobot.
The arduino software is a modified version of StandardFirmata in https://github.com/jpzg/pyFirmata-AFMS, as well as a Python module to make it easy to use.
The linux is a python program which accepts WebSocket connections and passes commands from them through to the arduino.
The webpage is a page for control/information display which can be used to drive the robot. Currently, I'm optimizing it for touch.

Since this is essentially just an arduino connected to something (running python) over serial, you could presumably replace the Yun with an uno and a Wifi Pineapple, or even a Raspberry Pi and control over Ethernet or something. Have fun.
