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
        #region variable declarations
        private int motor = 90;
        private Robot robot = new Robot("192.168.2.120", 3146);
        private Dictionary<Keys, bool> keyPressed = new Dictionary<Keys, bool>
        {
            {Keys.W,false},
            {Keys.S,false},
            {Keys.A,false},
            {Keys.D,false},
            {Keys.C,false},
            {Keys.Space,false}
        };
        #endregion

        public Form1()
        {
            InitializeComponent();
            KeyEvtProvider.KeyDown += KeyEvtProvider_KeyDown;
            KeyEvtProvider.KeyUp += KeyEvtProvider_KeyUp;
            timer1.Tick += timer1_Tick;
            timer1.Interval = 1000 / 60;
        }

        void timer1_Tick(object sender, EventArgs e)
        {
            if (keyPressed[Keys.W])
            {
                
            }
        }

        void KeyEvtProvider_KeyUp(object sender, KeyEventArgs e)
        {
            keyPressed[e.KeyCode] = false;
        }

        void KeyEvtProvider_KeyDown(object sender, KeyEventArgs e)
        {
            keyPressed[e.KeyCode] = true;
        }

        private void connect_button_Click(object sender, EventArgs e)
        {
            label1.Text = "Connecting";
            if (robot.Connect())
            {
                label1.Text = "Connected to Yun";
                connect_button.Enabled = false;
                KeyEvtProvider.Enabled = true;
                timer1.Enabled = true;
            }
            else
            {
                label1.Text = "Could not connect to Yun";
            }
        }

        private void led_button_Click(object sender, EventArgs e)
        {
            robot.setPin(13, !robot.getPin(13));
        }
    }
}
