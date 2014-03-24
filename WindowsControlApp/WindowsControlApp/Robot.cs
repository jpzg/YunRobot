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

        public void digitalWrite(int pin, int value)
        {
            socket.Send(toByteArray(String.Format("board.digital[{0}].write({1})",pin,value)));
        }

        public int digitalRead(int pin)
        {
            byte[] buffer = new byte[10];
            socket.Send(toByteArray(String.Format("board.digital[{0}].read()")));
            socket.Receive(buffer);
            return Convert.ToInt32(toString(buffer));
        }

        public void analogWrite(int pin, int value)
        {
            socket.Send(toByteArray(String.Format("board.analog[{0}].write({1})", pin, value)));
        }

        public int analogRead(int pin)
        {
            socket.Send(toByteArray(String.Format("board.analog[{0}].read()", pin)));

        }

        public void sendCommand(string cmd)
        {
            socket.Send(toByteArray(cmd));
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