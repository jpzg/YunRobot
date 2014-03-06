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
        private int lm = 90;
        private int rm = 90;
        private Robot robot = new Robot("192.168.2.120",3146);

        public Form1()
        {
            InitializeComponent();
            KeyEvtProvider.KeyDown += KeyEvtProvider_KeyDown;
            KeyEvtProvider.KeyUp += KeyEvtProvider_KeyUp;
        }

        void KeyEvtProvider_KeyUp(object sender, KeyEventArgs e)
        {
            
        }

        void KeyEvtProvider_KeyDown(object sender, KeyEventArgs e)
        {
            
        }

        private void button1_Click(object sender, EventArgs e)
        {
            label1.Text = "Connecting";
            if (robot.Connect())
            {
                label1.Text = "Connected to Yun";
                button1.Enabled = false;
                KeyEvtProvider.Enabled = true;
            }
            else
            {
                label1.Text = "Could not connect to Yun";
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            robot.setPin(13, !false);
        }
    }
}
