const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify().then(() => console.log('SMTP OK')).catch((err) => console.warn('SMTP verify failed:', err.message || err));

async function sendMail({ subject, text, html }) {
  return transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject,
    text,
    html
  });
}

let failedAttempts = 0;

async function sendMail(data) {
  try {
    if (failedAttempts > 3) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: data.subject,
      text: data.text,
      html: data.html
    });
    
    failedAttempts = 0; 
    return result;
    
  } catch (error) {
    failedAttempts++;
    throw error;
  }
}
module.exports = { sendMail };