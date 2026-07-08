import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { Reveal } from './Reveal';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-layout">
      {/* Editorial text */}
      <Reveal delay={0.1}>
        <div className="contact-text">
          <h3 className="contact-heading font-serif">Let's create something refined.</h3>
          <p className="contact-desc">
            Whether you want to discuss a system architecture challenge, visual graphics rendering, 
            or simply want to get in touch — drop a line.
          </p>
          <div className="contact-details font-sans">
            <div className="detail-item">
              <span className="label">Direct Inquiry</span>
              <a href="mailto:jeebanjyotimallik01@gmail.com" className="interactive link">
                jeebanjyotimallik01@gmail.com
              </a>
            </div>
            <div className="detail-item">
              <span className="label">Social Hubs</span>
              <div className="links-row">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="interactive link">
                  GitHub
                </a>
                <span className="sep">/</span>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="interactive link">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Sleek Form */}
      <Reveal delay={0.25}>
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="input-group">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={status === 'sending' || status === 'success'}
                placeholder="Your Name"
                className="contact-input interactive"
                autoComplete="off"
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'sending' || status === 'success'}
                placeholder="Email Address"
                className="contact-input interactive"
                autoComplete="off"
              />
            </div>

            <div className="input-group">
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                disabled={status === 'sending' || status === 'success'}
                placeholder="Message Description"
                rows={4}
                className="contact-textarea interactive"
              />
            </div>

            <button
              type="submit"
              className={`contact-submit-btn interactive ${status}`}
              disabled={status !== 'idle'}
            >
              {status === 'idle' && (
                <>
                  <span>Send Message</span>
                  <Send size={12} />
                </>
              )}
              {status === 'sending' && <span>Sending Message...</span>}
              {status === 'success' && (
                <>
                  <span>Message Received</span>
                  <Check size={14} className="green" />
                </>
              )}
            </button>
          </form>
        </div>
      </Reveal>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px;
          text-align: left;
          width: 100%;
          border-top: 1px solid var(--border-light);
          padding-top: 60px;
        }

        /* Text side */
        .contact-text {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .contact-heading {
          font-size: 2.2rem;
          font-weight: 300;
          color: var(--color-text-primary);
          line-height: 1.3;
        }
        .contact-desc {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
        
        .contact-details {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .detail-item .label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .detail-item .link {
          font-size: 0.9rem;
          color: var(--color-text-primary);
          text-decoration: none;
          align-self: flex-start;
          border-bottom: 1px solid transparent;
          transition: border-color 0.25s, color 0.25s;
          cursor: none;
        }
        .detail-item .link:hover {
          color: var(--accent-color);
          border-bottom-color: var(--accent-color);
        }
        .links-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .links-row .sep {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }

        /* Form side */
        .contact-form-wrapper {
          display: flex;
          flex-direction: column;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .input-group {
          position: relative;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 12px;
          transition: border-color 0.3s;
        }
        .input-group:focus-within {
          border-bottom-color: var(--color-text-primary);
        }
        .contact-input, .contact-textarea {
          width: 100%;
          font-size: 0.95rem;
          color: var(--color-text-primary);
          padding: 8px 0;
          cursor: none;
          transition: all 0.3s;
        }
        .contact-textarea {
          resize: none;
        }
        .contact-input::placeholder, .contact-textarea::placeholder {
          color: var(--color-text-muted);
          transition: color 0.3s;
        }
        .contact-input:focus::placeholder, .contact-textarea:focus::placeholder {
          color: var(--color-text-secondary);
        }

        /* Submit Button */
        .contact-submit-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-text-primary);
          color: var(--bg-dark);
          border: 1px solid var(--color-text-primary);
          padding: 14px 28px;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 10px;
        }
        .contact-submit-btn:hover:not(:disabled) {
          background: transparent;
          color: var(--color-text-primary);
        }
        .contact-submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }
        .contact-submit-btn.success {
          background: transparent;
          color: var(--accent-color);
          border-color: var(--accent-color);
        }
        .contact-submit-btn.success .green {
          color: var(--accent-color);
        }

        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
