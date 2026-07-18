const assert = require('assert');
const { hasSmtpConfig, hasPartialSmtpConfig, assertSmtpConfig } = require('./sendEmail');

const keys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
const saved = Object.fromEntries(keys.map(key => [key, process.env[key]]));

try {
  keys.forEach(key => delete process.env[key]);
  assert.strictEqual(hasSmtpConfig(), false);
  assert.strictEqual(hasPartialSmtpConfig(), false);

  process.env.SMTP_HOST = 'smtp.gmail.com';
  process.env.SMTP_USER = 'bsai23020@itu.edu.pk';
  assert.strictEqual(hasSmtpConfig(), false);
  assert.strictEqual(hasPartialSmtpConfig(), true);
  assert.throws(assertSmtpConfig, /SMTP_PASS/);

  process.env.SMTP_PASS = 'secret';
  assert.strictEqual(hasSmtpConfig(), true);
  assert.doesNotThrow(assertSmtpConfig);

  console.log('sendEmail SMTP config checks passed');
} finally {
  keys.forEach(key => {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  });
}
