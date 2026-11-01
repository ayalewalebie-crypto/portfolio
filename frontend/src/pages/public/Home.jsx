import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pub } from '../../services/api';
import { ArrowRight, Mail } from 'lucide-react';

// ── Brand SVGs ────────────────────────────────────────────────────────────────
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const TelegramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// Typewriter hook
const useTypewriter = (strings, speed = 80, pause = 1800) => {
  const [display, setDisplay] = useState('');
  const [idx,     setIdx]     = useState(0);
  const [phase,   setPhase]   = useState('typing');
  useEffect(() => {
    const str = strings[idx % strings.length];
    let timer;
    if (phase === 'typing') {
      if (display.length < str.length) timer = setTimeout(() => setDisplay(str.slice(0, display.length + 1)), speed);
      else timer = setTimeout(() => setPhase('pausing'), pause);
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), 400);
    } else {
      if (display.length > 0) timer = setTimeout(() => setDisplay(d => d.slice(0, -1)), speed / 2);
      else { setIdx(i => i + 1); setPhase('typing'); }
    }
    return () => clearTimeout(timer);
  }, [display, phase, idx, strings, speed, pause]);
  return { display, phase };
};

const CURRENT_YEAR = new Date().getFullYear();

// ── Count-up animation hook ───────────────────────────────────────────────────
const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const TYPEWRITER_STRINGS = [
  'Information Systems Student',
  'Full-Stack Developer',
  'Network Administration & Wireless Networking',
  'Problem Solver',
];


// ── Stats strip ───────────────────────────────────────────────────────────────
const StatCard = ({ value, label, suffix = '+' }) => {
  const count = useCountUp(value, 1000);
  return (
    <div className="flex flex-col items-center gap-2 fade-up">
      {/* Number box */}
      <div
        style={{
          background: 'var(--c-accent)',
          color: '#fff',
          fontFamily: 'var(--font-sans)',
          fontWeight: 900,
          fontSize: 'clamp(1.6rem,3.5vw,2.4rem)',
          lineHeight: 1,
          padding: '14px 28px',
          borderRadius: '12px',
          minWidth: '90px',
          textAlign: 'center',
          boxShadow: '0 6px 24px var(--cyan-glow)',
          letterSpacing: '-0.02em',
        }}
      >
        {count}{suffix}
      </div>
      {/* Label */}
      <span
        style={{
          color: 'var(--c-text-70)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </span>
    </div>
  );
};

const StatsStrip = ({ stats }) => {
  if (!stats) return null;

  const items = [
    { value: stats.yearsExp,         suffix: '+', label: 'Year Exp.' },
    { value: stats.projectsCount,    suffix: '+', label: 'Projects'  },
    { value: stats.skillsCount,      suffix: '+', label: 'Skills'    },
    { value: stats.certificationsCount, suffix: '+', label: 'Certificates' },
  ].filter(i => i.value > 0);

  if (!items.length) return null;

  return (
    <div
      style={{
        background: 'var(--c-surface)',
        borderTop:    '1px solid var(--c-border-xs)',
        borderBottom: '1px solid var(--c-border-xs)',
        padding: '40px 16px',
      }}
    >
      <div
        className="max-w-4xl mx-auto"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'clamp(28px,6vw,72px)',
        }}
      >
        {items.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [stats,   setStats]   = useState(null);
  const { display, phase } = useTypewriter(TYPEWRITER_STRINGS);

  useEffect(() => {
    pub.getProfile().then(({ data }) => setProfile(data)).catch(() => {});
    pub.getStats().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const photoSrc = profile?.profilePhoto
    ? (profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `http://localhost:5000${profile.profilePhoto}`)
    : null;

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ paddingTop: '80px', paddingBottom: '60px',
          background: 'var(--c-section)' }}>

        {/* Purple orbs + dot grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Top-right orb */}
          <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full"
            style={{ background: 'radial-gradient(circle,var(--c-border) 0%,transparent 65%)', filter: 'blur(48px)' }} />
          {/* Mid-left orb */}
          <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(6,182,212,.12) 0%,transparent 65%)', filter: 'blur(36px)' }} />
          {/* Bottom-left orb */}
          <div className="absolute bottom-10 -left-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(8,145,178,.2) 0%,transparent 70%)', filter: 'blur(32px)' }} />
          {/* Bottom-right glow */}
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle,var(--c-accent-bg-sm) 0%,transparent 70%)', filter: 'blur(28px)' }} />
          {/* Purple dot grid */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: .06 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="var(--c-accent)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          {/* Horizontal purple line accent */}
          <div className="absolute top-1/2 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--c-border-xs), transparent)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h1 className="fade-up font-extrabold tracking-tight leading-tight mb-4"
                style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', color: 'var(--c-text)', fontFamily: 'var(--font-sans)' }}>
                Hi There!{' '}
                <span className="wave" role="img" aria-label="wave">👋🏻</span>
              </h1>

              <h2 className="fade-up fade-up-delay-1 font-extrabold tracking-tight mb-6"
                style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: 'var(--c-text)', fontFamily: 'var(--font-sans)' }}>
                I'M{' '}
                <strong style={{ color: 'var(--c-accent)' }}>
                  {profile?.name?.toUpperCase() || 'ALEBIE AYALEW'}
                </strong>
              </h2>

              {/* Typewriter */}
              <div className="fade-up fade-up-delay-2 mb-8 h-12 flex items-center">
                <span style={{ fontSize: 'clamp(1.1rem,2.5vw,1.6rem)', color: 'var(--c-accent)', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                  {display}
                  <span style={{
                    color: '#b562d6',
                    animation: phase === 'pausing' ? 'none' : 'blink 1s step-end infinite',
                  }}>|</span>
                </span>
                <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
              </div>

              {/* Social circles */}
              <div className="fade-up fade-up-delay-3 flex flex-wrap items-center gap-3 mb-10">
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                    className="social-icon-circle"><GithubIcon size={18} /></a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="social-icon-circle"><LinkedinIcon size={18} /></a>
                )}
                {profile?.telegram && (
                  <a href={`https://t.me/${profile.telegram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer"
                    aria-label="Telegram" className="social-icon-circle"><TelegramIcon size={18} /></a>
                )}
              </div>

              {/* CTAs */}
              <div className="fade-up fade-up-delay-4 flex flex-wrap gap-3">
                <Link to="/about"
                  className="btn-cyan inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}>
                  About Me <ArrowRight size={16} />
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: 'transparent', border: '2px solid var(--c-accent-50)', color: 'var(--c-accent)', fontFamily: 'var(--font-sans)' }}>
                  <Mail size={15} /> Contact Me
                </Link>
              </div>
            </div>

            {/* Photo / code block */}
            <div className="fade-up fade-up-delay-2 hidden lg:flex flex-shrink-0 items-center justify-center">
              {photoSrc ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-50"
                    style={{ background: 'linear-gradient(135deg,var(--c-accent),#0891b2)', transform: 'scale(1.1)' }} />
                  <img src={photoSrc} alt={profile?.name || 'Profile'}
                    className="relative w-64 h-64 xl:w-72 xl:h-72 object-cover avatar-glow" />
                </div>
              ) : (
                <div className="w-64 xl:w-72 rounded-2xl p-6 card-glow font-mono text-xs leading-6"
                  style={{ background: 'var(--c-code)' }}>
                  <div className="flex gap-1.5 mb-4">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div style={{ color: 'var(--c-text-50)' }}>
                    <span style={{ color: 'var(--c-accent)' }}>const</span>{' '}
                    <span style={{ color: 'var(--c-accent)' }}>developer</span> = {'{'}<br />
                    &nbsp;&nbsp;<span style={{ color: 'var(--c-teal)' }}>name</span>:{' '}
                    <span style={{ color: '#86efac' }}>"{profile?.name || 'Alebie'}"</span>,<br />
                    &nbsp;&nbsp;<span style={{ color: 'var(--c-teal)' }}>stack</span>:{' '}
                    [<span style={{ color: '#86efac' }}>"React"</span>, <span style={{ color: '#86efac' }}>"Node"</span>],<br />
                    &nbsp;&nbsp;<span style={{ color: 'var(--c-teal)' }}>available</span>:{' '}
                    <span style={{ color: '#f472b6' }}>true</span><br />
                    {'}'};
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════════════ */}
      <StatsStrip stats={stats} />

      {/* ══════════════════════════════════════════════════════════════
          ABOUT ME PREVIEW (short)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--c-section)', padding: '70px 16px' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-extrabold mb-8 text-center"
            style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--c-text)', fontFamily: 'var(--font-sans)' }}>
            LET ME <span style={{ color: 'var(--c-accent)' }}>INTRODUCE</span> MYSELF
          </h2>
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1">
              <p className="leading-loose text-base mb-4" style={{ color: 'var(--c-text-85)' }}>
                {profile?.introduction ||
                  "I'm a passionate Full Stack Developer focused on building modern, scalable, and user-friendly web and mobile applications — transforming ideas into real digital products."}
              </p>
              <p className="leading-loose" style={{ color: 'var(--c-text-70)', fontSize: '0.95rem' }}>
                My core stack includes{' '}
                <strong style={{ color: 'var(--c-accent)' }}>React, Node.js, MongoDB</strong> and{' '}
                <strong style={{ color: 'var(--c-accent)' }}>Cisco Networking</strong>.
              </p>
              <Link to="/about"
                className="inline-flex items-center gap-2 mt-6 text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ color: 'var(--c-accent)', fontFamily: 'var(--font-sans)' }}>
                Read more about me <ArrowRight size={14} />
              </Link>
            </div>

            {/* Profile photo (visible on all screens here) */}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
