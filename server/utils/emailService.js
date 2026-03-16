import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Create Gmail transporter using App Password
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${token}`;
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"ToolMate AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your ToolMate AI account",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #e8f4f0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(45, 138, 138, 0.08);">
                <tr>
                    <td style="padding: 40px 40px 24px; text-align: center;">
                        <div style="display: inline-block; padding: 12px; background: linear-gradient(135deg, #2d8a8a, #4da8a8); border-radius: 16px; margin-bottom: 24px;">
                            <img src="https://api.dicebear.com/7.x/shapes/svg?seed=toolmate" width="32" height="32" style="display: block;" alt="ToolMate AI" />
                        </div>
                        <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #1a2e35;">Welcome to ToolMate AI!</h1>
                        <p style="margin: 0; font-size: 14px; color: #5b7a7a; line-height: 1.6;">
                            Thanks for signing up. Please verify your email address to get started.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px 40px 40px; text-align: center;">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2d8a8a, #4da8a8); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 16px; box-shadow: 0 4px 20px rgba(45, 138, 138, 0.25);">
                            Verify Email Address
                        </a>
                        <p style="margin: 24px 0 0; font-size: 12px; color: #5b7a7a;">
                            This link will expire in 24 hours.<br/>
                            If you didn't create an account, you can safely ignore this email.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px 40px; background: #f0f7f5; text-align: center; border-top: 1px solid #e0ece9;">
                        <p style="margin: 0; font-size: 11px; color: #5b7a7a;">
                            &copy; 2026 ToolMate AI. All rights reserved.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send verification email to ${email}:`, err);
    throw new Error(
      "Failed to send verification email. Please try again later.",
    );
  }
};
