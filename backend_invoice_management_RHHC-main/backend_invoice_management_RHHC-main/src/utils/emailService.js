const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_APP_PASS, // Your email password or app password
    },
  });
};

/**
 * Send email with login credentials to staff
 * @param {string} to - Recipient email address
 * @param {string} name - Staff name
 * @param {string} mobile - Staff mobile number
 * @param {string} password - Generated password
 * @returns {Promise} - Promise that resolves when email is sent
 */
exports.sendStaffCredentialsEmail = async (to, name, mobile, password) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "RHHC"}" <${process.env.SMTP_USER || "noreply@rhhc.com"
        }>`,
      to: to,
      subject: "Your Staff Account Credentials - RHHC",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .header {
              background-color: #1447e6;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .credentials {
              background-color: white;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              border-left: 4px solid #1447e6;
            }
            .credential-item {
              margin: 10px 0;
              padding: 8px;
              background-color: #f5f5f5;
              border-radius: 3px;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              color: #1447e6;
              font-size: 16px;
              margin-top: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #777;
              font-size: 12px;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              padding: 10px;
              border-radius: 5px;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Welcome to RHHC Staff Portal</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Your staff account has been successfully created. Please find your login credentials below:</p>
              
              <div class="credentials">
                <div class="credential-item">
                  <div class="label">Mobile Number:</div>
                  <div class="value">${mobile}</div>
                </div>
                <div class="credential-item">
                  <div class="label">Password:</div>
                  <div class="value">${password}</div>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> Please keep your password secure and do not share it with anyone. 
                We recommend changing your password after your first login.
              </div>

              <p>You can now log in to the staff portal using your mobile number and password.</p>
              
              <p>If you have any questions or need assistance, please contact the administrator.</p>
              
              <p>Best regards,<br>RHHC Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to RHHC Staff Portal
        
        Dear ${name},
        
        Your staff account has been successfully created. Please find your login credentials below:
        
        Mobile Number: ${mobile}
        Password: ${password}
        
        Important: Please keep your password secure and do not share it with anyone. 
        We recommend changing your password after your first login.
        
        You can now log in to the staff portal using your mobile number and password.
        
        If you have any questions or need assistance, please contact the administrator.
        
        Best regards,
        RHHC Team
        
        ---
        This is an automated email. Please do not reply to this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} name - User name
 * @param {string} token - Reset token (JWT)
 * @returns {Promise} - Promise that resolves when email is sent
 */
exports.sendPasswordResetEmail = async (to, name, token) => {
  try {
    const transporter = createTransporter();

    // Get frontend URL from environment or use default
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "RHHC"}" <${process.env.SMTP_USER || "noreply@rhhc.com"}>`,
      to: to,
      subject: "Password Reset Request - RHHC",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .header {
              background-color: #1447e6;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #1447e6;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #0d3ab8;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #777;
              font-size: 12px;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              padding: 10px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .token-info {
              background-color: #f5f5f5;
              padding: 10px;
              border-radius: 5px;
              margin: 15px 0;
              font-size: 12px;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>We received a request to reset your password for your RHHC account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center; color: white;">
                <a href="${resetUrl}" style="color: white;" class="button" target="_blank">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="token-info">${resetUrl}</div>

              <div class="warning">
                <strong>⚠️ Important:</strong> 
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>For security reasons, this link can only be used once</li>
                </ul>
              </div>

              <p>If you have any questions or need assistance, please contact the administrator.</p>
              
              <p>Best regards,<br>RHHC Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};