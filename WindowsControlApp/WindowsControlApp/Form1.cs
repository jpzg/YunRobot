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
        private Robot robot = new Robot("192.168.1.105", 3146);

        public Form1()
        {
            InitializeComponent();
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
            }
            else
            {
                label1.Text = "Could not connect to Yun";
                textBox1.AppendText(t.Item2.Message + "\n");
            }
        }

        private void led_button_Click(object sender, EventArgs e)
        {
            robot.digitalWrite(13, Convert.ToInt32(!Convert.ToBoolean(robot.digitalRead(13))));
        }
    }
}
