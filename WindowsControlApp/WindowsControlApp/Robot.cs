using System;
using System.Net.Sockets;

namespace WindowsControlApp
{
    public class Robot
    {
        private Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        public string ip;
        public int port;
        public int speed;
        public int servo;

        public Robot(string ip,int port)
        {
            System.Net.IPAddress.Parse(ip);
            this.ip = ip;
            this.port = port;
        }

        public Tuple<bool,Exception> Connect()
        {
            try
            {
                socket.Connect(ip, port);
            }
            catch (Exception e)
            {
                return Tuple.Create<bool,Exception>(false,e);
            }
            return Tuple.Create<bool,Exception>(socket.Connected,null);
        }

        public void setSpeed(int speed)
        {
            this.speed = speed;
            socket.Send(toByteArray("motor:" + speed.ToString()));
        }

        public void steer(int position)
        {
            this.servo = position;
            socket.Send(toByteArray("servo:" + position.ToString()));
        }

        public void setPin(int pin, bool value)
        {
            socket.Send(toByteArray(String.Format("wpin:{0}>{1}", pin, Convert.ToByte(value))));
        }

        public bool getPin(int pin)
        {
            byte[] buffer = new byte[3];
            socket.Send(toByteArray("rpin:" + pin));
            socket.Receive(buffer);
            return Convert.ToBoolean(buffer[0]);
        }

        public static byte[] toByteArray(string s)
        {
            byte[] result = new byte[s.Length];
            for (int i = 0; i < s.Length; i++) { result[i] = Convert.ToByte(s[i]); }
            return result;
        }

        public static string toString(byte[] b)
        {
            string result = "";
            foreach (byte e in b) { result += b.ToString(); }
            return result;
        }
    }
}