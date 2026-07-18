const nodemailer = require('nodemailer');

const smtpKeys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];

const hasSmtpConfig = () => smtpKeys.every(key => Boolean(process.env[key]));
const hasPartialSmtpConfig = () => smtpKeys.some(key => Boolean(process.env[key]));

const assertSmtpConfig = () => {
  const missing = smtpKeys.filter(key => !process.env[key]);
  if (!missing.length) return;

  const err = new Error(`SMTP config incomplete. Missing: ${missing.join(', ')}`);
  err.code = 'SMTP_CONFIG_INCOMPLETE';
  throw err;
};

const sendEmail = async ({ to, subject, html }) => {
  if (hasPartialSmtpConfig()) assertSmtpConfig();

  let transporter;

  if (hasSmtpConfig()) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@rozgo.com';
  const fromName = process.env.SMTP_FROM_NAME || 'RozGo';

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });

  return {
    messageId: info.messageId,
    previewUrl: hasSmtpConfig() ? null : nodemailer.getTestMessageUrl(info),
  };
};

module.exports = { sendEmail, hasSmtpConfig, hasPartialSmtpConfig, assertSmtpConfig };
