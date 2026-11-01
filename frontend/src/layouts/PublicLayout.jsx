import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import {
  FiHome, FiUser, FiCode, FiMonitor,
  FiWifi, FiFileText, FiMail,
} from 'react-icons/fi';
import { FaGithub, FaStar, FaLinkedin, FaFacebook, FaInstagram, FaTelegram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { pub } from '../services/api';

const CURRENT_YEAR = new Date().getFullYear();

// ── Animated 3-dash hamburger ─────────────────────────────────────────────────
const Hamburger = ({ open, onClick }) => (
  <button
    onClick={onClick}
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    style={{
      width: '38px', height: '38px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '5px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px',
      borderRadius: '10px',
    }}
  >
    <span style={{
      display: 'block', height: '2px', borderRadius: '2px',
      background: '#22d3ee',
      width: open ? '20px' : '22px',
      transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
      transition: 'transform .25s ease, width .25s ease',
    }} />
    <span style={{
      display: 'block', height: '2px', borderRadius: '2px',
      background: '#22d3ee',
      width: open ? '0px' : '16px',
      opacity: open ? 0 : 1,
      transition: 'width .2s ease, opacity .15s ease',
    }} />
    <span style={{
      display: 'block', height: '2px', borderRadius: '2px',
      background: '#22d3ee',
      width: '20px',
      transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
      transition: 'transform .25s ease',
    }} />
  </button>
);

// ── Footer with social icons ──────────────────────────────────────────────────
const FooterWithSocials = ({ light = false }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    pub.getProfile()
      .then(({ data }) => { if (data && (data._id || data.email)) setProfile(data); })
      .catch(() => {});
  }, []);

  const has = (v) => v && typeof v === 'string' && v.trim() !== '';

  const icons = [
    has(profile?.github)    && { name:'GitHub',    icon:<FaGithub />,    url: profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`,                                color:'#e0f4fa' },
    has(profile?.linkedin)  && { name:'LinkedIn',  icon:<FaLinkedin />,  url: profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`,                  color:'#60a5fa' },
    has(profile?.facebook)  && { name:'Facebook',  icon:<FaFacebook />,  url: profile.facebook.startsWith('http') ? profile.facebook : `https://facebook.com/${profile.facebook}`,                    color:'#818cf8' },
    has(profile?.instagram) && { name:'Instagram', icon:<FaInstagram />, url: profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace(/^@/,'')}`, color:'#f472b6' },
    has(profile?.telegram)  && { name:'Telegram',  icon:<FaTelegram />,  url: `https://t.me/${profile.telegram.replace(/^@/,'')}`,                                                                      color:'#22d3ee' },
    has(profile?.email)     && { name:'Email',     icon:<FaEnvelope />,  url: `mailto:${profile.email}`,                                                                                                color:'#22d3ee' },
    has(profile?.phone)     && { name:'Phone',     icon:<FaPhone />,     url: `tel:${profile.phone}`,                                                                                                   color:'#4ade80' },
  ].filter(Boolean);

  return (
    <footer style={{ background: 'var(--c-footer)', borderTop: '1px solid var(--c-footer-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs" style={{ color: 'var(--c-footer-text)', fontFamily: 'var(--font-mono)' }}>
          © {CURRENT_YEAR} Alebie Ayalew · All rights reserved
        </p>
        {icons.length > 0 && (
          <div className="flex items-center gap-4">
            {icons.map(({ name, icon, url, color }) => (
              <a key={name} href={url}
                target={url.startsWith('mailto') || url.startsWith('tel') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                aria-label={name} title={name}
                style={{ color, fontSize:'18px', opacity:.65, transition:'opacity .2s, transform .2s', display:'inline-flex' }}
                onMouseEnter={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity='.65'; e.currentTarget.style.transform='translateY(0)'; }}>
                {icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

const NAV_LINKS = [
  { label: 'Home',            to: '/',                icon: FiHome      },
  { label: 'About',           to: '/about',           icon: FiUser      },
  { label: 'Skills',          to: '/skills',          icon: FiCode      },
  { label: 'Projects',        to: '/projects',        icon: FiMonitor   },
  { label: 'Networking Labs', to: '/networking-labs', icon: FiWifi      },
  { label: 'CV',              to: '/cv',              icon: FiFileText  },
  { label: 'Contact',         to: '/contact',         icon: FiMail      },
];

const PublicLayout = () => {
  const location                    = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [profile,    setProfile]    = useState(null);
  const [light,      setLight]      = useState(() => localStorage.getItem('theme') === 'light');

  // Apply / remove body class
  useEffect(() => {
    if (light) {
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [light]);

  useEffect(() => {
    pub.getProfile()
      .then(({ data }) => { if (data && (data._id || data.name)) setProfile(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY >= 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);
  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const logoPrefix = (() => {
    if (!profile?.name) return 'Al';
    const parts = profile.name.trim().split(/\s+/);
    return parts[0].slice(0, 2);
  })();

  const githubUrl = profile?.github?.trim()
    ? (profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`)
    : 'https://github.com';

  const navBg = scrolled
    ? {
        backgroundColor:      light ? 'rgba(240,249,255,.94)' : 'rgba(8,18,48,.92)',
        backdropFilter:       'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow:            '0 8px 32px rgba(0,10,40,.12)',
        borderBottom:         light ? '1px solid rgba(8,145,178,.15)' : '1px solid rgba(34,211,238,.12)',
      }
    : { backgroundColor: 'transparent' };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-mono)' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3" style={navBg}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex-shrink-0 select-none"
            style={{
              fontFamily:    "'Playfair Display', Georgia, serif",
              fontStyle:     'italic',
              fontWeight:    700,
              fontSize:      'clamp(1.6rem,3vw,2rem)',
              color:         '#22d3ee',
              lineHeight:    1,
              letterSpacing: '-0.02em',
              textDecoration:'none',
            }}>
            {logoPrefix}<span style={{ color: light ? '#0891b2' : '#e0f4fa' }}>.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" style={{ fontFamily: 'var(--font-sans)' }}>
            {NAV_LINKS.map(l => {
              const Icon = l.icon;
              const active = isActive(l.to);
              return (
                <Link key={l.to} to={l.to}
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all nav-link-cyan"
                  style={{
                    color:      active ? '#22d3ee' : light ? '#334155' : 'rgba(224,244,250,.8)',
                    background: active ? 'rgba(34,211,238,.1)' : 'transparent',
                  }}>
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  {l.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: '#22d3ee' }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: theme toggle + GitHub pill + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* ☀️ / 🌙 theme toggle */}
            <button
              onClick={() => setLight(v => !v)}
              aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
              title={light ? 'Dark mode' : 'Light mode'}
              style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                border: `1px solid ${light ? 'rgba(8,145,178,.35)' : 'rgba(34,211,238,.25)'}`,
                background: light ? 'rgba(8,145,178,.1)' : 'rgba(34,211,238,.08)',
                color: light ? '#0891b2' : '#22d3ee',
                transition: 'all .25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(20deg) scale(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}
            >
              {light ? <Moon size={15} strokeWidth={2.2} /> : <Sun size={15} strokeWidth={2.2} />}
            </button>
            <a href={githubUrl}
              target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg,#0891b2,#22d3ee)',
                color: '#fff',
                boxShadow: '0 3px 10px rgba(34,211,238,.4)',
                fontFamily: 'var(--font-sans)',
              }}>
              <FaGithub style={{ fontSize: '14px' }} />
              <FaStar   style={{ fontSize: '11px', opacity: .9 }} />
            </a>

            <div className="lg:hidden">
              <Hamburger open={mobileOpen} onClick={() => setMobileOpen(v => !v)} />
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          style={{
            background:           light ? 'rgba(240,249,255,.97)' : 'rgba(6,14,40,.97)',
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: mobileOpen ? `1px solid ${light ? 'rgba(8,145,178,.15)' : 'rgba(34,211,238,.15)'}` : 'none',
          }}
        >
          <nav className="px-4 py-4 grid grid-cols-2 gap-1.5" style={{ fontFamily: 'var(--font-sans)' }}>
            {NAV_LINKS.map(l => {
              const Icon = l.icon;
              const active = isActive(l.to);
              return (
                <Link key={l.to} to={l.to} onClick={close}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    color:      active ? '#22d3ee' : light ? '#334155' : 'rgba(224,244,250,.75)',
                    background: active ? 'rgba(34,211,238,.1)' : light ? 'rgba(8,145,178,.05)' : 'rgba(255,255,255,.03)',
                    border:     `1px solid ${active ? 'rgba(34,211,238,.2)' : light ? 'rgba(8,145,178,.15)' : 'rgba(255,255,255,.06)'}`,
                  }}>
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {l.label}
                </Link>
              );
            })}
            <a href={githubUrl} target="_blank" rel="noopener noreferrer"
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold mt-1"
              style={{ background: 'linear-gradient(135deg,#0891b2,#22d3ee)', color: '#fff', border: 'none' }}>
              <FaGithub size={15} />
              View GitHub Profile
            </a>
          </nav>
        </div>
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(2px)' }}
          onClick={close}
        />
      )}

      {/* Page content */}
      <main className="flex-1 pt-[68px]">
        <Outlet />
      </main>

      {/* Footer */}
      <FooterWithSocials light={light} />
    </div>
  );
};

export default PublicLayout;
