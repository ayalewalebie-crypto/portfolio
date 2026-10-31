import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaTelegram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { pub } from '../../services/api';

/**
 * "Find Me On" social icon circles.
 * Always fetches its own fresh copy from the API — no prop dependency.
 *
 * Props:
 *   title   — heading text (full mode only)
 *   compact — if true, renders a small inline row without heading/border/padding
 */
const SocialConnect = ({ title = 'Find Me On', compact = false }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    pub.getProfile()
      .then(({ data }) => {
        if (data && (data._id || data.email)) setProfile(data);
      })
      .catch(() => {});
  }, []);

  if (!profile) return null;

  const has = (v) => v && typeof v === 'string' && v.trim() !== '';

  const links = [
    has(profile.github) && {
      name: 'GitHub',
      icon: <FaGithub />,
      url:  profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`,
      bg:   '#24292e',
      glow: 'rgba(36,41,46,.6)',
    },
    has(profile.linkedin) && {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url:  profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`,
      bg:   '#0077b5',
      glow: 'rgba(0,119,181,.6)',
    },
    has(profile.facebook) && {
      name: 'Facebook',
      icon: <FaFacebook />,
      url:  profile.facebook.startsWith('http') ? profile.facebook : `https://facebook.com/${profile.facebook}`,
      bg:   '#1877f2',
      glow: 'rgba(24,119,242,.6)',
    },
    has(profile.instagram) && {
      name: 'Instagram',
      icon: <FaInstagram />,
      url:  profile.instagram.startsWith('http')
              ? profile.instagram
              : `https://instagram.com/${profile.instagram.replace(/^@/, '')}`,
      bg:   'radial-gradient(circle at 30% 110%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)',
      glow: 'rgba(214,36,159,.6)',
    },
    has(profile.telegram) && {
      name: 'Telegram',
      icon: <FaTelegram />,
      url:  `https://t.me/${profile.telegram.replace(/^@/, '')}`,
      bg:   '#229ED9',
      glow: 'rgba(34,158,217,.6)',
    },
    has(profile.email) && {
      name: 'Email',
      icon: <FaEnvelope />,
      url:  `mailto:${profile.email}`,
      bg:   '#a855f7',
      glow: 'rgba(168,85,247,.6)',
    },
    has(profile.phone) && {
      name: 'Phone',
      icon: <FaPhone />,
      url:  `tel:${profile.phone}`,
      bg:   '#25d366',
      glow: 'rgba(37,211,102,.6)',
    },
  ].filter(Boolean);

  if (links.length === 0) return null;

  /* ── Shared icon renderer ─────────────────────────────────────────────── */
  const IconLink = ({ name, icon, url, bg, glow, size }) => (
    <a
      key={name}
      href={url}
      target={url.startsWith('mailto') || url.startsWith('tel') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      aria-label={name}
      title={name}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, borderRadius: '50%',
        background: bg, color: '#fff', fontSize: size === '55px' ? '22px' : '17px',
        textDecoration: 'none', flexShrink: 0,
        transition: 'transform .3s ease, box-shadow .3s ease',
        boxShadow: `0 4px 14px ${glow}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${glow}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `0 4px 14px ${glow}`;
      }}
    >
      {icon}
    </a>
  );

  /* ── Compact mode: small inline row, no heading/border ───────────────── */
  if (compact) {
    return (
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-accent-dim)' }}>
          Find Me On
        </p>
        <div className="flex flex-wrap gap-3">
          {links.map(({ name, icon, url, bg, glow }) => (
            <IconLink key={name} name={name} icon={icon} url={url} bg={bg} glow={glow} size="42px" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Full mode: heading + description + large icons ──────────────────── */
  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 text-center"
      style={{ borderTop: '1px solid var(--border-accent3)' }}>
      <h2 className="font-extrabold mb-2"
        style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
        {title}
      </h2>
      <p className="text-sm mb-10" style={{ color: 'var(--text-dimmest)' }}>
        Feel free to <span style={{ color: 'var(--text-accent)' }}>connect</span> with me
      </p>
      <div className="flex items-center justify-center flex-wrap gap-5">
        {links.map(({ name, icon, url, bg, glow }) => (
          <IconLink key={name} name={name} icon={icon} url={url} bg={bg} glow={glow} size="55px" />
        ))}
      </div>
    </div>
  );
};

export default SocialConnect;
