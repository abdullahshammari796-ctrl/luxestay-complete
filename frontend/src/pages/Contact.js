import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <span className="tag fade-up">We're Here for You</span>
          <h1 className="fade-up-1">Get in Touch</h1>
          <p className="fade-up-2">Our concierge team is available 24/7 to assist with any enquiries</p>
        </div>
      </div>

      <div className="container contact-layout section">
        {/* Info */}
        <aside className="contact-info">
          <h3 className="contact-info__title">Contact Information</h3>
          <div className="contact-info__items">
            {[
              { icon: '📍', label: 'Address', val: 'The Palm Jumeirah, Dubai, UAE' },
              { icon: '📞', label: 'Phone', val: '+971 4 000 0000' },
              { icon: '✉️', label: 'Email', val: 'stay@luxestay.com' },
              { icon: '🕐', label: 'Concierge', val: '24 hours, 7 days a week' },
            ].map((item, i) => (
              <div key={i} className="contact-info__item">
                <div className="contact-info__icon">{item.icon}</div>
                <div>
                  <div className="contact-info__label">{item.label}</div>
                  <div className="contact-info__val">{item.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-info__hours">
            <h4 className="contact-info__hours-title">Reception Hours</h4>
            {[
              { day: 'Monday – Friday', time: '24 Hours' },
              { day: 'Saturday – Sunday', time: '24 Hours' },
              { day: 'Check-In', time: '3:00 PM' },
              { day: 'Check-Out', time: '12:00 PM' },
            ].map((h, i) => (
              <div key={i} className="contact-info__hour">
                <span>{h.day}</span><span>{h.time}</span>
              </div>
            ))}
          </div>

          <div className="contact-info__map">
            <div className="contact-info__map-placeholder">
              <span>🗺️</span>
              <p>The Palm Jumeirah<br />Dubai, UAE</p>
            </div>
          </div>
        </aside>

        {/* Form */}
        <main className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success fade-up">
              <div className="contact-success__icon">✦</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Our team will get back to you within 2 hours.</p>
              <button className="btn-outline" onClick={() => setSubmitted(false)}>Send Another Message</button>
            </div>
          ) : (
            <>
              <h3 className="contact-form-title">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form__row">
                  <div className="form-group">
                    <label>FULL NAME</label>
                    <input name="name" value={form.name} onChange={update} required placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <input type="email" name="email" value={form.email} onChange={update} required placeholder="your@email.com" />
                  </div>
                </div>
                <div className="contact-form__row">
                  <div className="form-group">
                    <label>PHONE NUMBER</label>
                    <input type="tel" name="phone" value={form.phone} onChange={update} placeholder="+971 XX XXX XXXX" />
                  </div>
                  <div className="form-group">
                    <label>SUBJECT</label>
                    <select name="subject" value={form.subject} onChange={update} required>
                      <option value="">Select a subject</option>
                      <option>Room Enquiry</option>
                      <option>Booking Assistance</option>
                      <option>Special Occasion</option>
                      <option>Group Reservation</option>
                      <option>Cancellation/Refund</option>
                      <option>General Feedback</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>MESSAGE</label>
                  <textarea name="message" value={form.message} onChange={update} required rows={6} placeholder="Tell us how we can help..." style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-primary contact-form__btn" disabled={loading}>
                  {loading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(13,8,5,.3)', borderTopColor: 'var(--dark)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending...</> : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </main>
      </div>

      {/* FAQ */}
      <section className="section contact-faq" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div className="section-header">
            <span className="tag">FAQs</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="divider-center" />
          </div>
          <div className="contact-faq__grid">
            {[
              { q: 'What are the check-in and check-out times?', a: 'Standard check-in is at 3:00 PM and check-out is at 12:00 PM. Early check-in and late check-out are available upon request, subject to availability.' },
              { q: 'Is breakfast included in the room rate?', a: 'Breakfast is not included in our standard rates. However, our Room & Breakfast packages are available. Please check our packages section or contact the concierge.' },
              { q: 'Do you offer airport transfers?', a: 'Yes, we offer private luxury airport transfers. Please contact our concierge team at least 24 hours prior to your arrival to arrange this service.' },
              { q: 'What is your cancellation policy?', a: 'Cancellations made 48+ hours before check-in receive a full refund. Cancellations within 48 hours are subject to a one-night charge.' },
              { q: 'Is parking available?', a: 'We offer complimentary valet parking for all hotel guests. Self-parking is also available.' },
              { q: 'Do you allow pets?', a: 'We are a pet-friendly hotel. Small pets (under 10kg) are welcome in selected rooms with prior notice. A pet fee applies.' },
            ].map((faq, i) => (
              <div key={i} className="contact-faq__item">
                <div className="contact-faq__q">✦ {faq.q}</div>
                <div className="contact-faq__a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
