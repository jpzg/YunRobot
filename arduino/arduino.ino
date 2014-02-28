#include <Bridge.h>
#include <Mailbox.h>
#include <Servo.h>

// Arduino-side script for controlling the Yun robot
// Servo library used to control motors: 0 = full reverse, 90 = stopped, 180 = full forward
Servo rightmotor;
Servo leftmotor;
String msg;
String cmd;
String arg;
char * s;
char * s2;
char * s3;
int index;
int index2;

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
    index = msg.indexOf(':');
    index = msg.indexOf('>');
    cmd = msg.substring(0,index-1);
    arg = msg.substring(index+1);
    arg.toCharArray(s,5);
    if(cmd == "lm"){
      leftmotor.write(atoi(s));
    }
    if(cmd == "rm"){
      rightmotor.write(atoi(s));
    }
    if(index2){
      msg.substring(index+1,index2-1).toCharArray(s2,3);
      msg.substring(index2+1).toCharArray(s3,3);
      if(cmd == "pin"){
          digitalWrite(atoi(s2),atoi(s3));
      }
    }
  }
}
