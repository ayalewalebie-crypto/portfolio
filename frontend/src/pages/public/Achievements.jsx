import React, { useEffect, useState } from 'react';
import { pub, UPLOADS_PROXY } from '../../services/api';
import { Trophy, Calendar, X, ZoomIn } from 'lucide-react';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

const COLORS = [
  { accent:'#fbbf24', glow:'rgba(251,191,36,.15)',  border:'rgba(251,191,36,.25)'  },
  { accent:'#a855f7', glow:'rgba(168,85,247,.12)',  border:'rgba(168,85,247,.25)'  },
  { accent:'#2dd4bf', glow:'rgba(45,212,191,.12)',  border:'rgba(45,212,191,.25)'  },
  { accent:'#f472b6', glow:'rgba(244,114,182,.12)', border:'rgba(244,114,182,.25)' },
];

// Resolve stored /uploads/... paths through the Vite proxy
const resolveImg = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/uploads/')) return `${UPLOADS_PROXY}${src.slice('/uploads'.length)}`;
  return src;
};

// ── Full-screen image lightbox ─────────────────────────────────────────────────
const Lightbox = ({ src, alt, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
        style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}
      >
        <X size={20} />
      </button>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        onClick={e => e.stopPropagation()}
        className="max-w-full max-h-[88vh] rounded-2xl object-contain"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,.6)' }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Achievements = () => {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState(null); // { src, alt }

  useEffect(() => {
    pub.getAchievements()
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'var(--section-bg)' }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,rgba(168,85,247,.2) 0%,transparent 70%)', filter: 'blur(40px)' }}
          />
          {[{top:'15%',left:'8%',s:22},{top:'65%',left:'6%',s:14},{top:'20%',left:'90%',s:18},{top:'70%',left:'88%',s:24}].map((st,i) => (
            <span key={i} className="absolute select-none" style={{ top:st.top, left:st.left, fontSize:`${st.s}px`, opacity:.15 }}>⭐</span>
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div
            className="flex items-center gap-2 mb-3"
            style={{ color:'rgba(251,191,36,.7)', fontSize:'12px', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}
          >
            <Trophy size={13} /> Achievements
          </div>
          <h1
            className="font-extrabold tracking-tight mb-2"
            style={{ fontSize:'clamp(2rem,5vw,3.2rem)', color:'var(--text-primary)', fontFamily:'var(--font-sans)' }}
          >
            Awards &amp; <strong style={{ color:'#fbbf24' }}>Recognitions</strong>
          </h1>
          <p style={{ color:'var(--text-dimmer)', fontSize:'14px' }}>
            Honours, certifications, and milestones earned along the journey.
          </p>
        </div>
      </div>

      {/* ── Cards grid ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Trophy size={48} style={{ color:'rgba(251,191,36,.2)', margin:'0 auto 12px' }} />
            <p style={{ color:'var(--text-dimmest)' }}>No achievements published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {items.map((item, i) => {
              const col   = COLORS[i % COLORS.length];
              const imgSrc = item.image ? resolveImg(item.image) : null;

              return (
                <div
                  key={item._id}
                  className="relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                  style={{
                    background:  'var(--bg-surface)',
                    border:      `1px solid ${col.border}`,
                    boxShadow:   `0 4px 20px ${col.glow}`,
                  }}
                >
                  {/* Accent top strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{ background: `linear-gradient(135deg,${col.accent},transparent)` }}
                  />

                  {/* Ghost ordinal number */}
                  <span
                    className="absolute bottom-2 right-4 font-extrabold select-none leading-none pointer-events-none"
                    style={{ fontSize:'5rem', opacity:.05, color:col.accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* ── Certificate image (if uploaded) ── */}
                  {imgSrc && (
                    <div className="relative overflow-hidden" style={{ maxHeight: '200px' }}>
                      <img
                        src={imgSrc}
                        alt={`${item.title} certificate`}
                        className="w-full object-cover"
                        style={{ maxHeight: '200px', objectPosition: 'top' }}
                      />
                      {/* Gradient fade into card body */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-12"
                        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-surface))' }}
                      />
                      {/* Zoom button */}
                      <button
                        onClick={() => setLightbox({ src: imgSrc, alt: item.title })}
                        className="absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(0,0,0,.45)', color: '#fff' }}
                        title="View full image"
                        aria-label="View certificate full size"
                      >
                        <ZoomIn size={14} />
                      </button>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="relative z-10 p-6">
                    {/* Trophy icon (shown only when no image) */}
                    {!imgSrc && (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: col.glow, border: `1px solid ${col.border}` }}
                      >
                        <Trophy size={22} style={{ color: col.accent }} />
                      </div>
                    )}

                    <h2
                      className="font-bold text-base leading-snug mb-1"
                      style={{ color:'var(--text-primary)', fontFamily:'var(--font-sans)' }}
                    >
                      {item.title}
                    </h2>

                    {item.issuer && (
                      <p className="text-xs font-semibold mb-1" style={{ color: col.accent }}>
                        {item.issuer}
                      </p>
                    )}

                    {item.date && (
                      <p
                        className="text-xs flex items-center gap-1 mb-3 font-mono"
                        style={{ color:'var(--text-faint)' }}
                      >
                        <Calendar size={10} /> {fmtDate(item.date)}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-sm leading-relaxed" style={{ color:'var(--text-dimmer)' }}>
                        {item.description}
                      </p>
                    )}

                    {/* "View certificate" text link */}
                    {imgSrc && (
                      <button
                        onClick={() => setLightbox({ src: imgSrc, alt: item.title })}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:opacity-80"
                        style={{ color: col.accent }}
                      >
                        <ZoomIn size={12} /> View certificate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default Achievements;
