using System;
using System.Net.Sockets;

namespace WindowsControlApp
{
    public class Robot
    {
        private Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        public string ip;
        public int port;

        public Robot(string ip,int port)
        {
            System.Net.IPAddress.Parse(ip);
            ip = this.ip;
            port = this.port;
        }

        public bool Connect()
        {
            socket.Connect(ip, port);
            return socket.Connected;
        }

        public void setSpeed(int speed)
        {
            socket.Send(toByteArray("motor:" + speed.ToString()));
        }

        public void steer(int position)
        {
            socket.Send(toByteArray("servo:" + position.ToString()));
        }

        public void setPin(int pin, bool value)
        {
            socket.Send(toByteArray(String.Format("wpin:{0}>{1}", pin, Convert.ToByte(value))));
        }

        public bool getPin(int pin)
        {
            socket.Send(toByteArray("rpin:" + pin));
            // Unfinished
        }

        public static byte[] toByteArray(string s)
        {
            byte[] result = new byte[s.Length];
            for (int i = 0; i < s.Length; i++) { result[i] = Convert.ToByte(s[i]); }
            return result;
        }
    }
}