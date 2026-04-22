
import nodemailer from "nodemailer";

export const sendResetEmail = async (toEmail, resetURL) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Aurum" <khushitiwari1237@gmail.com>>`,
    to: toEmail,
    subject: "Reset your Aurum password",
    html: `
      <div style="font-family:monospace;background:#0c0c0e;color:#e8dcc8;padding:40px;max-width:480px;margin:auto;border:1px solid #2a2a2a;">
        <div style="margin-bottom:32px;">
          <span style="font-size:18px;letter-spacing:0.15em;text-transform:uppercase;">AURUM</span>
        </div>
        <h2 style="font-size:24px;font-weight:300;margin-bottom:16px;color:#e8dcc8;">Password Reset</h2>
        <p style="font-size:13px;color:#78716c;line-height:1.7;margin-bottom:24px;">
          We received a request to reset your password. Click the button below to set a new one.
          This link expires in <strong style="color:#c9a96e;">1 hour</strong>.
        </p>
        <a href="${resetURL}"
           style="display:inline-block;background:#c9a96e;color:#0c0c0e;padding:12px 28px;
                  text-decoration:none;font-size:11px;letter-spacing:0.18em;
                  text-transform:uppercase;font-weight:500;">
          Reset Password
        </a>
        <p style="margin-top:24px;font-size:11px;color:#44403c;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="margin-top:32px;font-size:10px;color:#292524;letter-spacing:0.1em;text-transform:uppercase;">
          © 2025 Aurum
        </p>
      </div>
    `,
  });
};