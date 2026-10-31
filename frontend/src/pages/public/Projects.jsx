import React, { useEffect, useState } from 'react';
import { pub, UPLOADS_PROXY } from '../../services/api';
import { FolderKanban, ExternalLink, Star, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const fmtYear = (d) => d ? new Date(d).getFullYear() : '';

// Ensure any URL has a protocol so the browser navigates correctly.
// Handles: "example.com", "//example.com", "https://example.com"
const safeUrl = (url) => {
  if (!url) return '#';
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;       // already correct
  if (u.startsWith('//')) return `https:${u}`; // protocol-relative
  return `https://${u}`;                       // bare domain e.g. myapp.vercel.app
};

// Resolve screenshot URLs — uploaded files are stored as /uploads/... relative paths;
// use the Vite proxy so they load correctly from the public frontend.
const resolveImg = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/uploads/')) return `${UPLOADS_PROXY}${src.slice('/uploads'.length)}`;
  return src;
};

// ── Project detail modal ──────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const shots = project?.screenshots || [];

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!project) return null;

  const prevImg = () => setImgIdx(i => (i - 1 + shots.length) % shots.length);
  const nextImg = () => setImgIdx(i => (i + 1) % shots.length);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'var(--bg-backdrop)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col"
        style={{
          background: 'var(--bg-modal)',
          border: '1px solid var(--border-accent2)',
          boxShadow: '0 24px 80px rgba(0,0,0,.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'var(--bg-surface-strong)', color: 'var(--text-accent)' }}
          aria-label="Close">
          <X size={16} />
        </button>

        {/* Screenshot carousel */}
        {shots.length > 0 ? (
          <div className="relative w-full overflow-hidden rounded-t-3xl flex-shrink-0" style={{ height: '260px' }}>
            <img
              src={resolveImg(shots[imgIdx])}
              alt={`${project.title} screenshot ${imgIdx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,12,41,.9) 0%, transparent 60%)' }} />

            {/* Prev/Next */}
            {shots.length > 1 && (
              <>
                <button onClick={prevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}>
                  <ChevronRight size={16} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {shots.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ background: i === imgIdx ? '#a855f7' : 'rgba(255,255,255,.4)' }} />
                  ))}
                </div>
              </>
            )}

            {/* Category + featured badge overlaid */}
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              {project.category && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: 'var(--bg-accent-strong)', color: '#e9d5ff', border: '1px solid rgba(168,85,247,.4)' }}>
                  {project.category}
                </span>
              )}
              {project.isFeatured && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,.4)' }}>
                  <Star size={9} fill="currentColor" /> Featured
                </span>
              )}
            </div>
          </div>
        ) : (
          /* No screenshot — show gradient header */
          <div className="rounded-t-3xl flex items-center justify-center flex-shrink-0"
            style={{ height: '120px', background: 'linear-gradient(135deg,rgba(124,58,237,.4),rgba(168,85,247,.2))' }}>
            <FolderKanban size={40} style={{ color: 'var(--text-accent-ghost)' }} />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Title + year */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-extrabold text-xl leading-snug"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
              {project.title}
            </h2>
            {project.createdAt && (
              <span className="text-xs font-mono flex-shrink-0 mt-1"
                style={{ color: 'var(--text-accent-faint)' }}>
                {fmtYear(project.createdAt)}
              </span>
            )}
          </div>

          {/* Description */}
          {project.solution && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {project.solution}
            </p>
          )}

          {/* Problem + Objectives */}
          {project.problemBackground && (
            <div className="rounded-xl p-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-accent3)' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: 'var(--text-accent-dim)' }}>Problem</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {project.problemBackground}
              </p>
            </div>
          )}

          {/* Features */}
          {project.features?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: 'var(--text-accent-dim)' }}>Key Features</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"
                    style={{ color: 'var(--text-muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: '#a855f7' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          {project.technologies?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5"
                style={{ color: 'var(--text-accent-dim)' }}>Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-mono"
                    style={{ background: 'var(--bg-surface-strong)', color: 'rgba(168,85,247,.85)', border: '1px solid var(--border-accent4)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA buttons ── */}
          <div className="flex flex-wrap gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-accent3)' }}>
            {/* DEMO — primary big button */}
            {project.demoLink && (
              <a
                href={safeUrl(project.demoLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                  boxShadow: '0 6px 20px rgba(168,85,247,.45)',
                  minWidth: '140px',
                }}
              >
                <Play size={16} fill="white" /> Open Demo
              </a>
            )}

            {/* GitHub */}
            {project.githubLink && (
              <a
                href={safeUrl(project.githubLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 px-5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--bg-surface-strong)',
                  border: '1px solid var(--border-surface2)',
                  color: 'var(--text-secondary)',
                }}
              >
                <GithubIcon size={15} /> Source Code
              </a>
            )}

            {/* Docs */}
            {project.documentationLink && (
              <a
                href={safeUrl(project.documentationLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 px-5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--bg-teal-medium)',
                  border: '1px solid rgba(45,212,191,.25)',
                  color: '#2dd4bf',
                }}
              >
                <ExternalLink size={14} /> Docs
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Projects page ────────────────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');
  const [selected, setSelected] = useState(null);   // project detail modal

  useEffect(() => {
    pub.getProjects().then(({ data }) => setProjects(data)).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category || 'Project').filter(Boolean)))];
  const filtered   = filter === 'All' ? projects : projects.filter(p => (p.category || 'Project') === filter);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Banner */}
      <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-section)' }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,rgba(168,85,247,.25) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3"
            style={{ color: 'var(--text-accent-muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            <FolderKanban size={13} /> Projects
          </div>
          <h1 className="font-extrabold tracking-tight mb-2"
            style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
            My Recent <strong style={{ color: 'var(--text-accent)' }}>Works</strong>
          </h1>
          <p style={{ color: 'var(--text-dimmer)', fontSize: '14px' }}>
            Click any project to see details, screenshots and the live demo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filter tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={filter === cat
                  ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', boxShadow: '0 4px 14px rgba(168,85,247,.4)' }
                  : { background: 'var(--bg-surface-hover)', color: 'var(--text-accent)', border: '1px solid var(--border-accent2)' }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <FolderKanban size={48} style={{ color: 'var(--text-accent-ghost)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-dimmest)' }}>No projects yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(proj => {
              const cat = proj.category || 'Project';
              return (
                /* Clickable card — opens detail modal */
                <button
                  key={proj._id}
                  onClick={() => setSelected(proj)}
                  className="card-glow rounded-2xl overflow-hidden flex flex-col text-left transition-all hover:-translate-y-1 cursor-pointer w-full"
                  style={{ background: 'var(--bg-surface)' }}
                >
                  {/* Screenshot or placeholder */}
                  {proj.screenshots?.length > 0 ? (
                    <div className="h-44 overflow-hidden relative">
                      <img src={resolveImg(proj.screenshots[0])} alt={proj.title}
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                      {/* "Click to view" hint */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(124,58,237,.5)' }}>
                        <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm"
                          style={{ background: 'rgba(168,85,247,.8)' }}>
                          <Play size={14} fill="white" /> View Details
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 flex items-center justify-center relative"
                      style={{ background: 'linear-gradient(135deg,rgba(124,58,237,.3),rgba(168,85,247,.15))' }}>
                      <FolderKanban size={36} style={{ color: 'var(--text-accent-ghost)' }} />
                      <span className="absolute bottom-2 right-3 text-[10px] font-semibold"
                        style={{ color: 'var(--text-accent-faint)' }}>Click to view →</span>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: 'var(--bg-surface-strong)', color: 'var(--text-accent)', border: '1px solid var(--border-accent2)' }}>
                        {cat}
                      </span>
                      <div className="flex items-center gap-2">
                        {proj.isFeatured && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(251,191,36,.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,.3)' }}>
                            <Star size={9} fill="currentColor" /> Featured
                          </span>
                        )}
                        {proj.createdAt && (
                          <span className="text-xs font-mono" style={{ color: 'var(--text-accent-ghost)' }}>
                            {fmtYear(proj.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                      {proj.title}
                    </h2>

                    <p className="text-sm leading-relaxed flex-1 line-clamp-2"
                      style={{ color: 'var(--text-dimmer)' }}>
                      {proj.solution || proj.problemBackground || proj.objectives || 'Click to see full details.'}
                    </p>

                    {/* Tech pills */}
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-accent3)' }}>
                        {proj.technologies.slice(0, 4).map(t => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded font-mono"
                            style={{ background: 'var(--bg-surface-strong)', color: 'rgba(168,85,247,.8)', border: '1px solid var(--border-accent4)' }}>
                            {t}
                          </span>
                        ))}
                        {proj.technologies.length > 4 && (
                          <span className="text-[11px] px-2 py-0.5 rounded font-mono" style={{ color: 'var(--text-accent-faint)' }}>
                            +{proj.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom hint */}
                    <div className="flex items-center gap-3 mt-3 pt-3"
                      style={{ borderTop: '1px solid rgba(168,85,247,.08)' }}>
                      {proj.demoLink && (
                        <a
                          href={safeUrl(proj.demoLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:-translate-y-0.5"
                          style={{
                            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                            color: '#fff',
                            boxShadow: '0 3px 10px rgba(168,85,247,.35)',
                          }}
                        >
                          <Play size={11} fill="white" /> Play Demo
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={safeUrl(proj.githubLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--text-dimmest)' }}
                        >
                          <GithubIcon size={11} /> Source code
                        </a>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Project detail modal */}
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Projects;
