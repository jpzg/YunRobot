#include <Bridge.h>
#include <Mailbox.h>
#include <Process.h>
#include <Servo.h>

// Arduino-side script for controlling the Yun robot
// Servo library used to control motors: 0 = full reverse, 90 = stopped, 180 = full forward
Servo motor;
Servo servo;
String msg;
String cmd;
char s[3];
char s2[3];
char s3[1];
int index;
int index2;
char buf[20];
Process p;

void setup() {
  // Start bridge,start mailbox, attach motors
  motor.attach(9);
  servo.attach(10);
  Bridge.begin();
  Mailbox.begin();
  p.begin("python");
  p.addParameter("/mnt/sda1/linino.py");
  p.run();
  Serial.begin(9600);
  Serial.println("Hello world.");
}

void loop() {
    Serial.readBytesUntil('\n',buf,20);
    Serial.println(buf);
  if(Mailbox.messageAvailable() != 0){
    Mailbox.readMessage(msg,Mailbox.messageAvailable());
    //msg = String(buf);
    Serial.println("Echo:"+msg);
    //Serial.println(buf);
    index = msg.indexOf(':');
    index2 = msg.indexOf('>');
    cmd = msg.substring(0,index);
    msg.substring(index+1).toCharArray(s,5);
    if(cmd == "motor"){
      Serial.print("Changing motor speed: ");
      Serial.println(s);
      motor.write(atoi(s));
    }
    if(cmd == "servo"){
      Serial.print("Changing servo position: ");
      Serial.println(s);
      servo.write(atoi(s));
    }
    if(cmd == "rpin"){
      Mailbox.writeMessage(String(digitalRead(atoi(s))));
    }
    if(index2){
      msg.substring(index+1,index2).toCharArray(s2,5);
      msg.substring(index2+1).toCharArray(s3,3);
      if(cmd == "pin"){
        Serial.print("Changing pin. Pin #:");
        Serial.println(s2);
        digitalWrite(atoi(s2),atoi(s3));
      }
    }
    for(int i = 0;i < 20;i += 1){ buf[i] = ' '; }
  }
}
