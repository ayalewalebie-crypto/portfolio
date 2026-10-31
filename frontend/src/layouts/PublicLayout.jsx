import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import {
  FiHome, FiUser, FiCode, FiMonitor,
  FiWifi, FiAward, FiFileText, FiMail,
} from 'react-icons/fi';
import { FaGithub, FaStar, FaLinkedin, FaFacebook, FaInstagram, FaTelegram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { pub } from '../services/api';

const CURRENT_YEAR = new Date().getFullYear();

// ── Theme toggle icon button ──────────────────────────────────────────────────
const ThemeToggle = ({ dark, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    title={dark ? 'Light mode' : 'Dark mode'}
    style={{
      width: '36px', height: '36px',
      borderRadius: '10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      border: dark
        ? '1px solid rgba(168,85,247,.25)'
        : '1px solid rgba(124,58,237,.3)',
      background: dark
        ? 'rgba(168,85,247,.08)'
        : 'rgba(124,58,237,.1)',
      color: dark ? '#a855f7' : '#7c3aed',
      transition: 'all .25s ease',
      flexShrink: 0,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = dark ? 'rgba(168,85,247,.18)' : 'rgba(124,58,237,.2)';
      e.currentTarget.style.transform = 'rotate(20deg) scale(1.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = dark ? 'rgba(168,85,247,.08)' : 'rgba(124,58,237,.1)';
      e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
    }}
  >
    {dark
      ? <Sun  size={16} strokeWidth={2.2} />
      : <Moon size={16} strokeWidth={2.2} />
    }
  </button>
);

// ── Animated 3-dash hamburger ─────────────────────────────────────────────────
const Hamburger = ({ open, onClick, dark }) => {
  const dashColor = dark ? '#a855f7' : '#7c3aed';
  return (
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
        display: 'block', height: '2px', borderRadius: '2px', background: dashColor,
        width: open ? '20px' : '22px',
        transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
        transition: 'transform .25s ease, width .25s ease',
      }} />
      <span style={{
        display: 'block', height: '2px', borderRadius: '2px', background: dashColor,
        width: open ? '0px' : '16px',
        opacity: open ? 0 : 1,
        transition: 'width .2s ease, opacity .15s ease',
      }} />
      <span style={{
        display: 'block', height: '2px', borderRadius: '2px', background: dashColor,
        width: '20px',
        transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
        transition: 'transform .25s ease',
      }} />
    </button>
  );
};

// ── Footer with social icons ──────────────────────────────────────────────────
const FooterWithSocials = ({ dark }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    pub.getProfile()
      .then(({ data }) => { if (data && (data._id || data.email)) setProfile(data); })
      .catch(() => {});
  }, []);

  const has = (v) => v && typeof v === 'string' && v.trim() !== '';

  const icons = [
    has(profile?.github)    && { name:'GitHub',    icon:<FaGithub />,    url: profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`,                                color: dark ? '#f0e6ff' : '#0f172a' },
    has(profile?.linkedin)  && { name:'LinkedIn',  icon:<FaLinkedin />,  url: profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`,                  color:'#0077b5' },
    has(profile?.facebook)  && { name:'Facebook',  icon:<FaFacebook />,  url: profile.facebook.startsWith('http') ? profile.facebook : `https://facebook.com/${profile.facebook}`,                    color:'#1877f2' },
    has(profile?.instagram) && { name:'Instagram', icon:<FaInstagram />, url: profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace(/^@/,'')}`, color:'#e1306c' },
    has(profile?.telegram)  && { name:'Telegram',  icon:<FaTelegram />,  url: `https://t.me/${profile.telegram.replace(/^@/,'')}`,                                                                      color:'#229ed9' },
    has(profile?.email)     && { name:'Email',     icon:<FaEnvelope />,  url: `mailto:${profile.email}`,                                                                                                color:'#a855f7' },
    has(profile?.phone)     && { name:'Phone',     icon:<FaPhone />,     url: `tel:${profile.phone}`,                                                                                                   color:'#25d366' },
  ].filter(Boolean);

  return (
    <footer style={{
      background: dark ? 'rgb(5,10,30)' : 'rgb(250,245,255)',
      borderTop: dark ? '1px solid rgba(168,85,247,.15)' : '1px solid rgba(124,58,237,.15)',
      transition: 'background .3s ease',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs" style={{
          color: dark ? 'rgba(168,85,247,.5)' : 'rgba(124,58,237,.7)',
          fontFamily: 'var(--font-mono)',
        }}>
          © {CURRENT_YEAR} Alebie Ayalew · All rights reserved
        </p>
        {icons.length > 0 && (
          <div className="flex items-center gap-4">
            {icons.map(({ name, icon, url, color }) => (
              <a key={name} href={url}
                target={url.startsWith('mailto') || url.startsWith('tel') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                aria-label={name} title={name}
                style={{ color, fontSize:'18px', opacity:.7, transition:'opacity .2s, transform .2s', display:'inline-flex' }}
                onMouseEnter={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity='.7'; e.currentTarget.style.transform='translateY(0)'; }}>
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
  { label: 'Achievements',    to: '/achievements',    icon: FiAward     },
  { label: 'CV',              to: '/cv',              icon: FiFileText  },
  { label: 'Contact',         to: '/contact',         icon: FiMail      },
];

// ── Persist theme to <html data-theme> + localStorage ────────────────────────
const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
};

const PublicLayout = () => {
  const location                    = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [profile,    setProfile]    = useState(null);
  const [dark,       setDark]       = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => { applyTheme(dark); }, [dark]);

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

  const toggle = () => setDark(d => !d);
  const close  = () => setMobileOpen(false);
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

  // Theme-aware colours — all purple now
  const C = {
    navBg: scrolled
      ? dark
        ? 'rgba(14,4,40,.92)'
        : 'rgba(250,245,255,.94)'
      : 'transparent',
    navBorder: scrolled
      ? dark ? 'rgba(168,85,247,.12)' : 'rgba(124,58,237,.15)'
      : 'transparent',
    logoAccent:  '#a855f7',
    logoDot:     dark ? '#f0e6ff' : '#7c3aed',
    linkActive:  '#a855f7',
    linkInactive: dark ? 'rgba(240,230,255,.8)' : '#334155',
    linkActiveBg: dark ? 'rgba(168,85,247,.1)' : 'rgba(124,58,237,.08)',
    linkUnderline:'#a855f7',
    mobileBg:    dark ? 'rgba(10,3,35,.97)' : 'rgba(250,245,255,.97)',
    mobileBorder: dark ? 'rgba(168,85,247,.15)' : 'rgba(124,58,237,.15)',
    mobileLink:  dark ? 'rgba(240,230,255,.75)' : '#334155',
    mobileLinkBg: dark ? 'rgba(255,255,255,.03)' : 'rgba(124,58,237,.05)',
    mobileLinkBorder: dark ? 'rgba(255,255,255,.06)' : 'rgba(124,58,237,.15)',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-mono)' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3"
        style={{
          backgroundColor:      C.navBg,
          backdropFilter:       scrolled ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
          boxShadow:            scrolled ? '0 8px 32px rgba(0,10,40,.12)' : 'none',
          borderBottom:         `1px solid ${C.navBorder}`,
          transition:           'background-color .3s ease, border-color .3s ease, box-shadow .3s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link to="/" onClick={close} className="flex-shrink-0 select-none"
            style={{
              fontFamily:    "'Playfair Display', Georgia, serif",
              fontStyle:     'italic',
              fontWeight:    700,
              fontSize:      'clamp(1.6rem,3vw,2rem)',
              color:         C.logoAccent,
              lineHeight:    1,
              letterSpacing: '-0.02em',
              textDecoration:'none',
            }}>
            {logoPrefix}<span style={{ color: C.logoDot }}>.</span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-1" style={{ fontFamily: 'var(--font-sans)' }}>
            {NAV_LINKS.map(l => {
              const Icon = l.icon;
              const active = isActive(l.to);
              return (
                <Link key={l.to} to={l.to}
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all nav-link-cyan"
                  style={{
                    color:      active ? C.linkActive : C.linkInactive,
                    background: active ? C.linkActiveBg : 'transparent',
                  }}>
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  {l.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: C.linkUnderline }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: theme toggle + GitHub pill + hamburger ── */}
          <div className="flex items-center gap-2 flex-shrink-0">

            <ThemeToggle dark={dark} onToggle={toggle} />

            {/* GitHub pill */}
            <a href={githubUrl}
              target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                color: '#fff',
                boxShadow: '0 3px 10px rgba(168,85,247,.35)',
                fontFamily: 'var(--font-sans)',
              }}>
              <FaGithub style={{ fontSize: '14px' }} />
              <FaStar   style={{ fontSize: '11px', opacity: .9 }} />
            </a>

            <div className="lg:hidden">
              <Hamburger open={mobileOpen} dark={dark} onClick={() => setMobileOpen(v => !v)} />
            </div>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          style={{
            background:           C.mobileBg,
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: mobileOpen ? `1px solid ${C.mobileBorder}` : 'none',
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
                    color:      active ? C.linkActive : C.mobileLink,
                    background: active ? C.linkActiveBg : C.mobileLinkBg,
                    border:     `1px solid ${active ? 'rgba(168,85,247,.2)' : C.mobileLinkBorder}`,
                  }}>
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {l.label}
                </Link>
              );
            })}

            {/* GitHub in mobile menu */}
            <a href={githubUrl} target="_blank" rel="noopener noreferrer"
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold mt-1"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none' }}>
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

      {/* ── Page content ──────────────────────────────────────────────── */}
      <main className="flex-1 pt-[68px]">
        <Outlet />
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <FooterWithSocials dark={dark} />
    </div>
  );
};

export default PublicLayout;
