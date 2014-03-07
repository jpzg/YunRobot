namespace WindowsControlApp
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.connect_button = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.KeyEvtProvider = new MouseKeyboardActivityMonitor.Controls.MouseKeyEventProvider();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.led_button = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.SuspendLayout();
            // 
            // connect_button
            // 
            this.connect_button.Location = new System.Drawing.Point(12, 12);
            this.connect_button.Name = "connect_button";
            this.connect_button.Size = new System.Drawing.Size(75, 23);
            this.connect_button.TabIndex = 0;
            this.connect_button.Text = "Connect";
            this.connect_button.UseVisualStyleBackColor = true;
            this.connect_button.Click += new System.EventHandler(this.connect_button_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 38);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(112, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Not connected to Yun";
            // 
            // KeyEvtProvider
            // 
            this.KeyEvtProvider.Enabled = false;
            this.KeyEvtProvider.HookType = MouseKeyboardActivityMonitor.Controls.HookType.Global;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(13, 55);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(36, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "motor:";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 68);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(36, 13);
            this.label3.TabIndex = 3;
            this.label3.Text = "servo:";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(12, 84);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.ReadOnly = true;
            this.textBox1.Size = new System.Drawing.Size(260, 165);
            this.textBox1.TabIndex = 4;
            // 
            // led_button
            // 
            this.led_button.Enabled = false;
            this.led_button.Location = new System.Drawing.Point(93, 12);
            this.led_button.Name = "led_button";
            this.led_button.Size = new System.Drawing.Size(75, 23);
            this.led_button.TabIndex = 5;
            this.led_button.Text = "LED";
            this.led_button.UseVisualStyleBackColor = true;
            this.led_button.Click += new System.EventHandler(this.led_button_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 261);
            this.Controls.Add(this.led_button);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.connect_button);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button connect_button;
        private System.Windows.Forms.Label label1;
        private MouseKeyboardActivityMonitor.Controls.MouseKeyEventProvider KeyEvtProvider;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button led_button;
        private System.Windows.Forms.Timer timer1;
    }
}

