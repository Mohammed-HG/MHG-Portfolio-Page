const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { sendMail } = require('../services/mailer');
const axios = require('axios');

const router = express.Router();

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: 'Too many requests' } });

function hasHeaderInjection(s = '') { return /[\r\n]/.test(String(s)); }
function escapeHtml(s = '') { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Single POST '/' route with conditional reCAPTCHA validator
const recaptchaValidator = process.env.RECAPTCHA_SECRET_KEY
  ? body('recaptchaToken').notEmpty().withMessage('reCAPTCHA token is required')
  : body('recaptchaToken').optional({ checkFalsy: true });

router.post(
  '/',
  contactLimiter, // rate limit
  recaptchaValidator, // require token only if server has secret
  body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message is required'),
  async (req, res) => {
    // 3. تحقق من حقل الفخ (Honeypot)
    if (req.body._gotcha) return res.status(400).json({ error: 'Spam detected' });

    // 4. تحقق من صحة البيانات باستخدام express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ error: 'Invalid input', details: errors.array() });

    const { name, email, message, recaptchaToken } = req.body; // استخرج رمز reCAPTCHA

    // 5. تحقق من حقن الرؤوس
    if (hasHeaderInjection(name) || hasHeaderInjection(email)) return res.status(400).json({ error: 'Invalid input' });

    // ✅ **6. تحقق من صحة reCAPTCHA مع Google**
    try {
      const recaptchaResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null, // للـ GET أو POST بدون body، استخدم query params
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY, // استخدم المفتاح السري المخزن في البيئة
            response: recaptchaToken // الرمز المرسل من الفرونتند
          }
        }
      );

      console.log('reCAPTCHA RESPONSE DATA:', recaptchaResponse.data);

      // إذا فشلت Google في التحقق من الرمز
      if (!recaptchaResponse.data.success) {
        console.warn('reCAPTCHA failed:', recaptchaResponse.data['error-codes']);
        return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
      }

    } catch (recaptchaError) {
      console.error('Error verifying reCAPTCHA:', recaptchaError);
      return res.status(500).json({ error: 'Could not verify reCAPTCHA' });
    }

    // 7. إذا نجح كل شيء، أرسل البريد الإلكتروني
    const safeHtml = `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`;

    try {
      await sendMail({
        subject: `Contact from portfolio: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: safeHtml
      });
      return res.json({ ok: true });
    } catch (err) {
      console.error('Mail error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }
);

module.exports = router;