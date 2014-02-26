#include <Bridge.h>
#include <Mailbox.h>
#include <Servo.h>

// Arduino-side script for controlling the Yun robot
// Servo library used to control motors: 0 = full reverse, 90 = stopped, 180 = full forward
Servo rightmotor;
Servo leftmotor;
String msg;

void setup() {
  // Start bridge,start mailbox, attach motors
  rightmotor.attach(9);
  leftmotor.attach(10);
  Bridge.begin();
  Mailbox.begin();
  
}

void loop() {
  if(Mailbox.messageAvailable() != 0){
    Mailbox.readMessage(msg,Mailbox.messageAvailable());
  }
  //if(msg.readStringUntil(':') == 'lm'){
    //leftmotor.write(int(msg.readString
  //}
}
