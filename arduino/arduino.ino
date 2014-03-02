#include <Bridge.h>
#include <Mailbox.h>
#include <Servo.h>

// Arduino-side script for controlling the Yun robot
// Servo library used to control motors: 0 = full reverse, 90 = stopped, 180 = full forward
Servo rightmotor;
Servo leftmotor;
String msg;
String cmd;
char s[3];
char s2[3];
char s3[1];
int index;
int index2;
char buf[20];

void setup() {
  // Start bridge,start mailbox, attach motors
  rightmotor.attach(9);
  leftmotor.attach(10);
  //Bridge.begin();
  //Mailbox.begin();
  Serial.begin(9600);
  Serial.println("Hello world.");
}

void loop() {
  if(Serial.available()){//Mailbox.messageAvailable() != 0){
    //Mailbox.readMessage(msg,Mailbox.messageAvailable());
    Serial.readBytesUntil('\n',buf,20);
    msg = String(buf);
    Serial.println("Echo:"+msg);
    Serial.println(buf);
    index = msg.indexOf(':');
    index2 = msg.indexOf('>');
    cmd = msg.substring(0,index);
    msg.substring(index+1).toCharArray(s,5);
    if(cmd == "lm"){
      leftmotor.write(atoi(s));
    }
    if(cmd == "rm"){
      rightmotor.write(atoi(s));
    }
    if(index2){
      msg.substring(index+1,index2).toCharArray(s2,5);
      msg.substring(index2+1).toCharArray(s3,3);
      if(cmd == "pin"){
        Serial.println("Changing pin. Pin #:");
        Serial.println(s2);
        digitalWrite(atoi(s2),atoi(s3));
      }
    }
    for(int i = 0;i < 20;i += 1){ buf[i] = ' '; }
  }
}
