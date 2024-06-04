const nodemailer = require("nodemailer");
const { mailing } = require("../config/config");

const transporter = nodemailer.createTransport({
  service: mailing.emailService,
  port: mailing.emailPort,
  auth: {
    user: mailing.auth.emailUser,
    pass: mailing.auth.emailPassword,
  },
});

const sendResetEmail = (email, token) => {
  const resetUrl = `http://localhost:8080/account/reset-password?token=${token}`;

  const mailOptions = {
    from: "no-reply@yourapp.com",
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in one hour.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = {
  sendResetEmail,
};
