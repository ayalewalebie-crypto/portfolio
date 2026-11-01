import React, { useEffect, useState } from 'react';
import { pub } from '../../services/api';
import { X } from 'lucide-react';
import SkillIcon, { getSkillIcon } from '../../components/public/SkillIcon';

const CAT_ICON = {
  Frontend:'⚛️', Backend:'🖥️', Database:'🗄️', Languages:'💻',
  Networking:'🌐', Tools:'🛠️', Mobile:'📱', IoT:'📡', DevOps:'⚙️', Other:'📦',
};

// ── Detail modal ──────────────────────────────────────────────────────────────
const SkillModal = ({ skill, onClose }) => {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!skill) return null;
  const match = getSkillIcon(skill.name);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'var(--c-overlay)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'var(--c-modal)', border: '1px solid var(--c-accent-bg-lg)', boxShadow: '0 24px 80px rgba(0,0,0,.7)' }}
        onClick={e => e.stopPropagation()}>
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#0891b2,var(--c-accent))' }} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center z-10"
          style={{ background: 'var(--c-surface-md)', color: 'var(--c-accent)' }}>
          <X size={16} />
        </button>
        <div className="p-7 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--c-surface-md)', border: '1px solid var(--c-accent-bg-lg)' }}>
              <SkillIcon name={skill.name} size={30} />
            </div>
            <div>
              <h2 className="font-extrabold text-xl" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-sans)' }}>
                {skill.name}
              </h2>
              <span className="text-xs" style={{ color: 'var(--c-accent-50)' }}>
                {CAT_ICON[skill.category] || '📦'} {skill.category}
              </span>
            </div>
          </div>

          {/* Description */}
          {skill.description ? (
            <div className="rounded-2xl p-5"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-accent-bg-md)' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5"
                style={{ color: 'var(--c-accent-60)' }}>About this skill</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text-85)' }}>
                {skill.description}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'var(--c-surface)', border: '1px dashed var(--c-accent-bg-md)' }}>
              <p className="text-xs italic" style={{ color: 'var(--c-accent-40)' }}>No description added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Skill pill ─────────────────────────────────────────────────────────────────
const SkillPill = ({ skill, onClick }) => {
  const name  = typeof skill === 'string' ? skill : skill.name;
  const match = getSkillIcon(name);

  return (
    <button
      onClick={() => typeof skill !== 'string' && skill.description !== undefined && onClick(skill)}
      className="inline-flex items-center gap-2.5 transition-all hover:scale-105"
      style={{
        padding: '10px 20px',
        borderRadius: '999px',
        background: 'var(--c-surface)',
        border: '1.5px solid var(--c-accent-40)',
        color: 'var(--c-text)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '4px 5px 4px 3px rgba(6,182,212,.12)',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border-sm)'; }}
    >
      {/* Icon — safe rendering for both svg and si types */}
      {match ? (
        match.type === 'svg' ? (
          <img src={match.src} alt={name} width={20} height={20}
            style={{ objectFit: 'contain', flexShrink: 0 }}
            onError={e => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <match.Icon size={18} style={{ color: match.color, flexShrink: 0 }} />
        )
      ) : (
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--c-accent)', flexShrink: 0, display: 'inline-block' }} />
      )}
      {name}
    </button>
  );
};

// ── Fallback skills when DB is empty ──────────────────────────────────────────
const FALLBACK = {
  Frontend:  ['React', 'Tailwind CSS', 'HTML5', 'CSS3', 'JavaScript'],
  Backend:   ['Node.js', 'Express.js', 'PHP'],
  Database:  ['MongoDB', 'MySQL', 'Firebase'],
  Languages: ['Python', 'C++'],
  Mobile:    ['Flutter'],
  Networking:['Cisco', 'Cisco Packet Tracer'],
  Tools:     ['Git', 'GitHub', 'VS Code', 'Postman'],
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Skills = () => {
  const [skills,   setSkills]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    pub.getSkills()
      .then(({ data }) => setSkills(Array.isArray(data) ? data : []))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  const groups = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  const display    = skills.length > 0 ? groups : FALLBACK;
  const isFallback = skills.length === 0;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Banner */}
      <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'var(--c-section)' }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle,var(--c-accent-bg-md) 0%,transparent 70%)', filter: 'blur(40px)', opacity: .3 }} />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="font-extrabold tracking-tight mb-2"
            style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'var(--c-text)', fontFamily: 'var(--font-sans)' }}>
            Professional <strong style={{ color: 'var(--c-accent)' }}>Skillset</strong>
          </h1>
          <p style={{ color: 'var(--c-text-60)', fontSize: '14px' }}>
            Technologies and tools I work with every day.
            {!isFallback && (
              <span style={{ color: 'var(--c-accent-50)' }}> Click any skill to see details.</span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-4 w-24 rounded-full shimmer mx-auto mb-6" />
                <div className="flex flex-wrap justify-center gap-3">
                  {Array.from({ length: 5 }).map((_, j) => <div key={j} className="h-11 w-32 rounded-full shimmer" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(display).map(([cat, catSkills]) => (
              <div key={cat} className="text-center">
                <h3 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-7"
                  style={{ color: 'var(--c-accent-70)' }}>
                  <span className="h-px w-8 hidden sm:block" style={{ background: 'var(--c-accent-bg-md)' }} />
                  <span>{CAT_ICON[cat] || '📦'}</span>
                  {cat}
                  <span className="h-px w-8 hidden sm:block" style={{ background: 'var(--c-accent-bg-md)' }} />
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {catSkills.map(sk => (
                    <SkillPill
                      key={typeof sk === 'string' ? sk : sk._id}
                      skill={sk}
                      onClick={setSelected}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && <SkillModal skill={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Skills;
