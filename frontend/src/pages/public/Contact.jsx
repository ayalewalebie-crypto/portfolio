import React, { useEffect, useState } from 'react';
import { pub } from '../../services/api';
import SocialConnect from '../../components/public/SocialConnect';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const INIT = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [form,    setForm]    = useState(INIT);
  const [status,  setStatus]  = useState(null); // null | 'sending' | 'success' | 'error'
  const [errMsg,  setErrMsg]  = useState('');

  useEffect(() => {
    pub.getProfile().then(({ data }) => setProfile(data)).catch(() => {});
  }, []);

  const has = (v) => v && typeof v === 'string' && v.trim() !== '';

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    setErrMsg('');
    try {
      await pub.contact(form);
      setStatus('success');
      setForm(INIT);
      // Auto-reset after 5 s
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Hero label ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-4 text-center">
        <p className="section-label justify-center">
          <span style={{ width: 28, height: 1, background: '#a855f7', display: 'inline-block' }} />
          Get In Touch
          <span style={{ width: 28, height: 1, background: '#a855f7', display: 'inline-block' }} />
        </p>
        <h1 className="font-extrabold mb-3"
          style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
          Contact <span style={{ color: 'var(--text-accent)' }}>Me</span>
        </h1>
        <p style={{ color: 'var(--text-dimmest)', fontSize: '14px', maxWidth: 480, margin: '0 auto' }}>
          Have a project idea, a question, or just want to connect? Send me a message and I'll get back to you.
        </p>
      </section>

      {/* ── Two-column layout: info left, form right ─────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── Left: contact info ──────────────────────────────────── */}
          <div>
            <h2 className="font-bold text-lg mb-6"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', letterSpacing: '-.01em' }}>
              Contact Information
            </h2>

            <div className="flex flex-col gap-5">
              {has(profile?.email) && (
                <InfoRow label="Email" href={`mailto:${profile.email}`} value={profile.email} />
              )}
              {has(profile?.phone) && (
                <InfoRow label="Phone" href={`tel:${profile.phone}`} value={profile.phone} />
              )}
              {has(profile?.location) && (
                <InfoRow label="Location" value={profile.location} />
              )}
              {!profile && (
                ['Email', 'Phone', 'Location'].map(label => (
                  <div key={label} className="flex items-baseline gap-3">
                    <span className="font-bold text-base"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', minWidth: '80px' }}>
                      {label}:
                    </span>
                    <div className="h-5 w-44 rounded shimmer" />
                  </div>
                ))
              )}
            </div>

            {/* Divider */}
            <div className="my-8" style={{ height: 1, background: 'var(--bg-accent-medium)' }} />

            {/* Social connect */}
            <SocialConnect compact />
          </div>

          {/* ── Right: contact form ─────────────────────────────────── */}
          <div className="rounded-3xl p-7 sm:p-8"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-accent)',
              boxShadow: 'none',
            }}>

            {/* Success state */}
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.3)' }}>
                  <CheckCircle2 size={30} style={{ color: '#10b981' }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--text-dimmest)', fontSize: '14px', maxWidth: 280 }}>
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <h2 className="font-bold text-base mb-5"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                  Send a Message
                </h2>

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    name="name" label="Your Name" placeholder="Alebie Ayalew"
                    value={form.name} onChange={handleChange} required />
                  <FormInput
                    name="email" label="Email Address" type="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required />
                </div>

                <FormInput
                  name="subject" label="Subject" placeholder="What is this about?"
                  value={form.subject} onChange={handleChange} />

                {/* Message textarea */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: 'var(--text-dimmest)' }}>
                    Message <span style={{ color: 'var(--text-accent)' }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project or question…"
                    value={form.message}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-accent4)',
                      borderRadius: '14px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color .2s',
                    }}
                    onFocus={e  => (e.target.style.borderColor = 'var(--border-input-focus)')}
                    onBlur={e   => (e.target.style.borderColor = 'var(--border-input)')}
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#fca5a5' }}>
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    {errMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'sending' || !form.name.trim() || !form.email.trim() || !form.message.trim()}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '13px 24px',
                    borderRadius: '14px',
                    background: status === 'sending'
                      ? 'rgba(168,85,247,.3)'
                      : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    border: 'none',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    opacity: (!form.name.trim() || !form.email.trim() || !form.message.trim()) ? .5 : 1,
                    transition: 'all .25s ease',
                    boxShadow: '0 6px 24px rgba(168,85,247,.25)',
                  }}
                  onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {status === 'sending'
                    ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                    : <><Send size={15} /> Send Message</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

/* ── Small sub-components ──────────────────────────────────────────────────── */

const InfoRow = ({ label, href, value }) => (
  <div className="flex items-baseline gap-3">
    <span className="font-bold text-base flex-shrink-0"
      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', minWidth: '80px' }}>
      {label}:
    </span>
    {href ? (
      <a href={href} style={{ color: 'var(--text-accent)', fontFamily: 'var(--font-mono)', fontSize: '14px', wordBreak: 'break-all' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-accent)')}>
        {value}
      </a>
    ) : (
      <span style={{ color: 'var(--text-accent)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>{value}</span>
    )}
  </div>
);

const FormInput = ({ name, label, type = 'text', placeholder, value, onChange, required }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
      style={{ color: 'var(--text-dimmest)' }}>
      {label} {required && <span style={{ color: 'var(--text-accent)' }}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={{
        width: '100%',
        padding: '11px 14px',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-accent4)',
        borderRadius: '12px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        fontFamily: 'var(--font-mono)',
        outline: 'none',
        transition: 'border-color .2s',
      }}
      onFocus={e  => (e.target.style.borderColor = 'var(--border-input-focus)')}
      onBlur={e   => (e.target.style.borderColor = 'var(--border-input)')}
    />
  </div>
);

export default Contact;
