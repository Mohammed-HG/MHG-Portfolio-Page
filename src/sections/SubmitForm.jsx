import React, { useState } from 'react';

const ContactForm = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    setStatus('Sending...');

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        form.reset();
      } else {
        setStatus('Oops! There was a problem.');
      }
    } catch (error) {
      setStatus('Oops! There was a problem.');
    }
  };

  return (
    <section className="contact-section" id="Contact">
      <div className="contact-container">
        <h2 className="contact-title">Get In Touch</h2>
        
        <form 
          onSubmit={handleSubmit}
          action="https://formspree.io/f/YOUR_FORM_ID_HERE"
          method="POST"
          className="contact-form"
        >
          <input type="hidden" name="_subject" value="New message from portfolio!" />
          
          <input type="hidden" name="_replyto" value="" id="email-field" />
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              required
              onChange={(e) => {
                document.getElementById('email-field').value = e.target.value;
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your message here..."
              rows="5"
              required
            />
          </div>

          <input type="text" name="_gotcha" style={{display: 'none'}} />

          <button type="submit" className="submit-btn">
            Send Message
          </button>

          {status && (
            <div className={`status-message ${status.includes('success') ? 'success' : 'error'}`}>
              {status}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;