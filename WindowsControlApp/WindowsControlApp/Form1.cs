using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Sockets;
using MouseKeyboardActivityMonitor.WinApi;

namespace WindowsControlApp
{
    public partial class Form1 : Form
    {
        public Socket socket = new Socket(SocketType.Stream, ProtocolType.Tcp);
        private int lm = 90;
        private int rm = 90;

        public Form1()
        {
            InitializeComponent();
            KeyEvtProvider.KeyDown += KeyEvtProvider_KeyDown;
            KeyEvtProvider.KeyUp += KeyEvtProvider_KeyUp;
            timer1.Interval = 1000 / 60; // Refresh 60 times per second
            timer1.Tick += timer1_Tick;
        }

        void timer1_Tick(object sender, EventArgs e)
        {
            if (lm < 0) { lm = 0; }
            if (rm < 0) { rm = 0; }
            if (lm > 180) { lm = 180; }
            if (rm > 180) { rm = 180; }
            label2.Text = String.Format("left motor: {0}", lm);
            label3.Text = String.Format("right motor: {0}", rm);
        }

        void KeyEvtProvider_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.W || e.KeyCode == Keys.S || e.KeyCode == Keys.Q || e.KeyCode == Keys.E)
            {
                lm = 90;
                rm = 90;
            }
            if (e.KeyCode == Keys.A)
            {
                lm += 20;
                rm -= 20;
            }
            else if (e.KeyCode == Keys.D)
            {
                lm -= 20;
                rm += 20;
            }
        }

        void KeyEvtProvider_KeyDown(object sender, KeyEventArgs e)
        {
            if(e.KeyCode == Keys.W){
                lm = 150;
                rm = 150;
            }
            else if (e.KeyCode == Keys.S)
            {
                lm = 50;
                rm = 50;
            }
            if (e.KeyCode == Keys.A)
            {
                lm -= 20;
                rm += 20;
            }
            else if (e.KeyCode == Keys.D)
            {
                lm += 20;
                rm -= 20;
            }
            if(e.KeyCode == Keys.Q || e.KeyCode == Keys.E && (lm != 90 || rm != 90)){
                e.SuppressKeyPress = true;
            }
            if (e.KeyCode == Keys.Q)
            {
                lm = 60;
                rm = 120;
            }
            else if (e.KeyCode == Keys.E)
            {
                lm = 120;
                rm = 60;
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            label1.Text = "Connecting";
            //socket.Connect("arduino.local", 3146);
            //if (socket.Connected)
            //{
                label1.Text = "Connected to Yun";
                button1.Enabled = false;
                timer1.Enabled = true;
                KeyEvtProvider.Enabled = true;
            //}
            //else
            //{
            //    label1.Text = "Could not connect to Yun";
            //}
        }
    }
}
