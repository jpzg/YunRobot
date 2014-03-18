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
            timer1.Interval = 1000/60;
        }

        void timer1_Tick(object sender, EventArgs e)
        {
            if (keyPressed[Keys.W] || keyPressed[Keys.S])
            {
                robot.setSpeed(motor);
            }
            if (!keyPressed[Keys.W] && !keyPressed[Keys.S])
            {
                robot.setSpeed(90);
            }
            if (keyPressed[Keys.A] && robot.servo < 180)
            {
                robot.steer(robot.servo + 1);
            }
            if (keyPressed[Keys.D] && robot.servo > 0)
            {
                robot.steer(robot.servo - 1);
            }
            if (keyPressed[Keys.C] && motor < 180)
            {
                motor += 1;
            }
            if (keyPressed[Keys.Space] && motor > 0)
            {
                motor -= 1;
            }
            label2.Text = "motor: " + motor;
            label3.Text = "servo: " + robot.servo;
        }

        void KeyEvtProvider_KeyUp(object sender, KeyEventArgs e)
        {
            if (!keyPressed.ContainsKey(e.KeyCode)) { keyPressed.Add(e.KeyCode, false); return; }
            keyPressed[e.KeyCode] = false;
        }

        void KeyEvtProvider_KeyDown(object sender, KeyEventArgs e)
        {
            if (!keyPressed.ContainsKey(e.KeyCode)) { keyPressed.Add(e.KeyCode, true); return; }
            keyPressed[e.KeyCode] = true;
        }

        private void connect_button_Click(object sender, EventArgs e)
        {
            label1.Text = "Connecting";
            Tuple<bool,Exception> t = robot.Connect();
            if (t.Item1)
            {
                label1.Text = "Connected to Yun";
                connect_button.Enabled = false;
                led_button.Enabled = true;
                KeyEvtProvider.Enabled = true;
                timer1.Enabled = true;
            }
            else
            {
                label1.Text = "Could not connect to Yun";
                textBox1.AppendText(t.Item2.Message + "\n");
            }
        }

        private void led_button_Click(object sender, EventArgs e)
        {
            robot.setPin(13, !robot.getPin(13));
        }
    }
}
