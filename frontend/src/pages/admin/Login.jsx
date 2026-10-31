import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react';

const DotGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

const CURRENT_YEAR = new Date().getFullYear();

const Login = () => {
  const [email,   setEmail]   = useState('');
  const [password,setPassword]= useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email:    email.trim(),
        password,
      });
      login(data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all";

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'var(--font-sans,Inter,sans-serif)' }}>

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-center p-14 overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#060d28 0%,#071430 40%,#0c1a3a 100%)' }}>
        <DotGrid />
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#0891b2 0%,transparent 70%)' }} />
        <div className="absolute -bottom-16 -right-16 w-[320px] h-[320px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#06b6d4 0%,transparent 70%)' }} />

        {/* Centre content — no logo, big "Admin" heading */}
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-10"
            style={{ background: 'rgba(8,145,178,.2)', border: '1px solid rgba(8,145,178,.35)' }}>
            <Shield size={40} style={{ color: '#a5b4fc' }} />
          </div>

          {/* Large "Admin" — no "Console" */}
          <h1 style={{
            fontFamily:  'var(--font-serif,"Playfair Display",Georgia,serif)',
            fontSize:    'clamp(4rem,8vw,7rem)',
            fontWeight:  800,
            color:       '#ffffff',
            lineHeight:  1.05,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
          }}>
            Admin
          </h1>

          <p className="text-lg leading-relaxed mb-10" style={{ color: '#94a3b8', maxWidth: '360px' }}>
            Manage your portfolio content, projects, and profile — all from one secure place.
          </p>

          <ul className="space-y-3">
            {[
              'Edit profile & bio in real-time',
              'Add and manage projects',
              'View messages from visitors',
              'Track certifications & skills',
            ].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm" style={{ color: '#94a3b8' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(8,145,178,.25)' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom copyright */}
        <p className="absolute bottom-8 left-14 text-xs z-10" style={{ color: '#334155' }}>
          © {CURRENT_YEAR} · Restricted access only
        </p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#f9f7f4]">

        <div className="w-full max-w-[400px]">

          {/* Mobile heading */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(8,145,178,.12)', border: '1px solid rgba(8,145,178,.3)' }}>
              <Shield size={28} style={{ color: '#0891b2' }} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-serif,"Playfair Display",Georgia,serif)' }}>
              Admin
            </h2>
          </div>

          {/* Desktop welcome text */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Welcome back</h2>
            <p className="text-sm text-slate-400">Sign in to access your dashboard.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required autoComplete="email"
                  className={`${inputBase} pl-9 pr-4`} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••" required autoComplete="current-password"
                  className={`${inputBase} pl-9 pr-11`} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-bold text-sm mt-2 disabled:opacity-60 hover:-translate-y-0.5 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg,#0891b2,#0891b2)',
                boxShadow:  '0 4px 24px -4px rgba(8,145,178,.45)',
              }}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                : 'Sign in to dashboard'
              }
            </button>
          </form>

          <p className="text-center text-xs text-slate-300 mt-8">
            This area is restricted to authorised administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
