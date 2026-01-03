import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha'; 
import "../styles/SubmitForm.css";

const ContactForm = () => {
  const [status, setStatus] = useState('');
  const recaptchaRef = useRef(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const gotcha = form._gotcha?.value;
    
    if (gotcha) return setStatus('Spam blocked');

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    const recaptchaToken = recaptchaRef.current?.getValue?.();

    if (siteKey) {
      if (!recaptchaToken) {
        setStatus('Please confirm you are not a robot.');
        return;
      }
    } else {
      console.warn('VITE_RECAPTCHA_SITE_KEY is not set');
    }
    
    setStatus('Sending...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, recaptchaToken })
      });

      if (res.ok) {
        setStatus('Message sent successfully!');
        form.reset();
        recaptchaRef.current?.reset?.();
      } else {
        const json = await res.json().catch(() => ({}));
        setStatus(json.error || 'Server error');
      }
    } catch (err) {
      setStatus('Network error');
    }
  };

  return (
    <section className="contact-section" id="Contact">
      <div className="contact-container">
        <h2 className="contact-title">Contact us</h2>
        
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Your message" required />
            </div>
          </div>

          <input type="text" name="_gotcha" style={{ display: 'none' }} />

          {import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
            <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={() => {}} />
          )}

          <button type="submit" className="submit-btn">Send Message</button>

          {status && <div className={`status-message ${status.includes('success') ? 'success' : 'error'}`}>{status}</div>}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
