const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  let transporter;

  // If real SMTP config is provided, use it
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Otherwise use Ethereal (fake email service) for development testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const info = await transporter.sendMail({
    from: '"RozGo Admin" <noreply@rozgo.com>',
    to,
    subject,
    html,
  });

  if (!process.env.SMTP_HOST) {
    console.log(`✉️  Preview Email: ${nodemailer.getTestMessageUrl(info)}`);
  }
};

module.exports = sendEmail;
