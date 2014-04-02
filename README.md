YunRobot
========

Arduino and python programs for arduino yun controlling a robot via wifi and Websockets, with a control webpage served by the Yun. Using a web interface rather than TCP as before means the best possible cross-compatibility, without me writing more than one app.
Currently, the arduino is nothing but the slave of the linino processor, which does nothing but pass commands from the websocket connection to the arduino. Later, it may have some autonomy through more complex programs on the linino.
