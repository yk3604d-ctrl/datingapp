const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS false for 587
  family: 4,     // force IPv4
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("[SMTP Verify] Connection failed:", error);
  } else {
    console.log("[SMTP Verify] Server is ready to take messages");
  }
});

const sendEmail = async (to, subject, text) => {
  console.log("[Send Email] Attempting to send email to:", to);
  console.log("[Send Email] Subject:", subject);
  console.log("[Send Email] Email body:", text);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("[Send Email] Email sent successfully. Info:", info);
    return info;
  } catch (error) {
    console.error("[Send Email] Error occurred:", error);

    if (error.response) {
      console.error("[Send Email] SMTP Response:", error.response);
    }

    if (error.code) {
      console.error("[Send Email] Error Code:", error.code);
    }

    throw error;
  }
};

module.exports = sendEmail;
