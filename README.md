YunRobot
========

<h3>Anyone who wants to help is welcome to.</h3>
If you find any of this code messy/confusing or want clarification on some part of the project, comment or email.

Arduino and python programs for arduino yun controlling a robot via wifi and Websockets, with a control webpage served by the Yun. Using a web interface rather than TCP as before means the best possible cross-compatibility, without anyone writing more than one app.
Currently, the arduino is nothing but the slave of the linino processor, which does barely more than pass commands from the websocket connection to the arduino. Later, it may have some autonomy through more complex programs on the linino.
