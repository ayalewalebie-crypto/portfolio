import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pub, getUploadUrl } from '../../services/api';
import { ArrowRight, Mail, Code2, FolderKanban, Network, FileText, Phone, Send, Loader2, CheckCircle2, AlertCircle, Play, ChevronDown, ChevronUp, Download, ExternalLink } from 'lucide-react';
import SkillIcon, { getSkillIcon } from '../../components/public/SkillIcon';
import useReveal from '../../hooks/useReveal';
import SocialConnect from '../../components/public/SocialConnect';

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
const StatCard = ({ value, label, suffix = '+', index = 0 }) => {
  const count = useCountUp(value, 1000);
  return (
    <div className={`flex flex-col items-center gap-2 reveal-scale delay-${((index % 4) + 1) * 100}`}>
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
          <StatCard key={i} {...item} index={i} />
        ))}
      </div>
    </div>
  );
};


const Home = () => {
  const [profile,  setProfile]  = useState(null);
  const [stats,    setStats]    = useState(null);
  const [skills,   setSkills]   = useState([]);
  const [projects, setProjects] = useState([]);
  const [labs,     setLabs]     = useState([]);
  const [cv,       setCv]       = useState(null);
  const [openLab,  setOpenLab]  = useState(null);
  const { display, phase } = useTypewriter(TYPEWRITER_STRINGS);
  const revealRef = useReveal();
  const [form,   setForm]   = useState({ name:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  

  useEffect(() => {
    pub.getProfile().then(({ data }) => setProfile(data)).catch(() => {});
    pub.getStats().then(({ data }) => setStats(data)).catch(() => {});
    pub.getSkills().then(({ data }) => setSkills(Array.isArray(data) ? data : [])).catch(() => {});
    pub.getProjects().then(({ data }) => setProjects(data)).catch(() => {});
    pub.getLabs().then(({ data }) => setLabs(data)).catch(() => {});
    pub.getCV().then(({ data }) => { if (data?._id) setCv(data); }).catch(() => {});
  }, []);

  const photoSrc = profile?.profilePhoto ? getUploadUrl(profile.profilePhoto) : null;

  const handleContact = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      await pub.contact(form);
      setStatus('success');
      setForm({ name:'', email:'', subject:'', message:'' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Something went wrong.');
      setStatus('error');
    }
  };

  const skillGroups = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  const CAT_ICON = { Frontend:'⚛️', Backend:'🖥️', Database:'🗄️', Languages:'💻', Networking:'🌐', Tools:'🛠️', Mobile:'📱', IoT:'📡', DevOps:'⚙️', Other:'📦' };

  const SectionHeading = ({ icon: Icon, title, accent, to }) => (
    <div className="flex items-center justify-between mb-10">
      <h2 className="reveal font-extrabold tracking-tight flex items-center gap-3"
        style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--c-text)', fontFamily: 'var(--font-sans)' }}>
        <span style={{ width:'44px', height:'44px', borderRadius:'12px', background:`${accent}22`, border:`1px solid ${accent}44`, display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={20} style={{ color: accent }} />
        </span>
        {title}
      </h2>
      <Link to={to} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:-translate-y-0.5"
        style={{ color: accent, fontFamily: 'var(--font-sans)' }}>
        View All <ArrowRight size={14} />
      </Link>
    </div>
  );

  return (
    <div ref={revealRef} className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ paddingTop:'80px', paddingBottom:'60px', background:'var(--c-section)' }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full" style={{ background:'radial-gradient(circle,var(--c-border) 0%,transparent 65%)', filter:'blur(48px)' }}/>
          <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full" style={{ background:'radial-gradient(circle,rgba(6,182,212,.12) 0%,transparent 65%)', filter:'blur(36px)' }}/>
          <div className="absolute bottom-10 -left-32 w-96 h-96 rounded-full" style={{ background:'radial-gradient(circle,rgba(8,145,178,.2) 0%,transparent 70%)', filter:'blur(32px)' }}/>
          <svg className="absolute inset-0 w-full h-full" style={{ opacity:.06 }} xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="var(--c-accent)"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="flex-1 min-w-0">
              <h1 className="fade-up font-extrabold tracking-tight leading-tight mb-4" style={{ fontSize:'clamp(2.4rem,6vw,4.5rem)', color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>
                Hi There! <span className="wave" role="img" aria-label="wave">👋🏻</span>
              </h1>
              <h2 className="fade-up fade-up-delay-1 font-extrabold tracking-tight mb-6" style={{ fontSize:'clamp(1.8rem,5vw,3.5rem)', color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>
                I'M <strong style={{ color:'var(--c-accent)' }}>{profile?.name?.toUpperCase() || 'ALEBIE AYALEW'}</strong>
              </h2>
              <div className="fade-up fade-up-delay-2 mb-8 h-12 flex items-center">
                <span style={{ fontSize:'clamp(1.1rem,2.5vw,1.6rem)', color:'var(--c-accent)', fontWeight:600, fontFamily:'var(--font-sans)' }}>
                  {display}<span style={{ color:'#b562d6', animation: phase==='pausing'?'none':'blink 1s step-end infinite' }}>|</span>
                </span>
                <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
              </div>
              <div className="fade-up fade-up-delay-3 flex flex-wrap items-center gap-3 mb-10">
                {profile?.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-icon-circle"><GithubIcon size={18}/></a>}
                {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon-circle"><LinkedinIcon size={18}/></a>}
                {profile?.telegram && <a href={`https://t.me/${profile.telegram.replace(/^@/,'')}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="social-icon-circle"><TelegramIcon size={18}/></a>}
              </div>
              <div className="fade-up fade-up-delay-4 flex flex-wrap gap-3">
                <Link to="/about" className="btn-cyan inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm" style={{ fontFamily:'var(--font-sans)' }}>
                  About Me <ArrowRight size={16}/>
                </Link>
                <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5"
                  style={{ background:'transparent', border:'2px solid var(--c-accent-50)', color:'var(--c-accent)', fontFamily:'var(--font-sans)' }}>
                  <Mail size={15}/> Contact Me
                </a>
              </div>
            </div>
            <div className="fade-up fade-up-delay-2 hidden lg:flex flex-shrink-0 items-center justify-center">
              {photoSrc ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-50" style={{ background:'linear-gradient(135deg,var(--c-accent),#0891b2)', transform:'scale(1.1)' }}/>
                  <img src={photoSrc} alt={profile?.name||'Profile'} className="relative w-64 h-64 xl:w-72 xl:h-72 object-cover avatar-glow"/>
                </div>
              ) : (
                <div className="w-64 xl:w-72 rounded-2xl p-6 card-glow font-mono text-xs leading-6" style={{ background:'var(--c-code)' }}>
                  <div className="flex gap-1.5 mb-4">
                    <span className="w-3 h-3 rounded-full bg-rose-500"/><span className="w-3 h-3 rounded-full bg-amber-400"/><span className="w-3 h-3 rounded-full bg-emerald-500"/>
                  </div>
                  <div style={{ color:'var(--c-text-50)' }}>
                    <span style={{ color:'var(--c-accent)' }}>const</span> <span style={{ color:'var(--c-accent)' }}>developer</span> = {'{'}<br/>
                    &nbsp;&nbsp;<span style={{ color:'var(--c-teal)' }}>name</span>: <span style={{ color:'#86efac' }}>"{profile?.name||'Alebie'}"</span>,<br/>
                    &nbsp;&nbsp;<span style={{ color:'var(--c-teal)' }}>stack</span>: [<span style={{ color:'#86efac' }}>"React"</span>, <span style={{ color:'#86efac' }}>"Node"</span>],<br/>
                    &nbsp;&nbsp;<span style={{ color:'var(--c-teal)' }}>available</span>: <span style={{ color:'#f472b6' }}>true</span><br/>
                    {'}'};
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsStrip stats={stats} />

      {/* INTRODUCE MYSELF */}
      <section style={{ background:'var(--c-section)', padding:'70px 16px' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="reveal font-extrabold mb-8 text-center" style={{ fontSize:'clamp(1.4rem,3vw,2rem)', color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>
            LET ME <span style={{ color:'var(--c-accent)' }}>INTRODUCE</span> MYSELF
          </h2>
          <div className="flex-1">
            <p className="leading-loose text-base mb-4" style={{ color:'var(--c-text-85)' }}>
              {profile?.introduction || "I'm a passionate Full Stack Developer focused on building modern, scalable web applications."}
            </p>
            <p className="leading-loose" style={{ color:'var(--c-text-70)', fontSize:'0.95rem' }}>
              My core stack includes <strong style={{ color:'var(--c-accent)' }}>React, Node.js, MongoDB</strong> and <strong style={{ color:'var(--c-accent)' }}>Cisco Networking</strong>.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 mt-6 text-sm font-bold transition-all hover:-translate-y-0.5" style={{ color:'var(--c-accent)', fontFamily:'var(--font-sans)' }}>
              Read more about me <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding:'80px 16px', background:'var(--c-bg,linear-gradient(160deg,#06152e 0%,#0a1d4a 50%,#061230 100%))' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading icon={Code2} title="Professional Skillset" accent="#22d3ee" to="/skills"/>
          <div className="space-y-10">
            {Object.entries(skillGroups).length > 0 ? Object.entries(skillGroups).map(([cat, catSkills]) => (
              <div key={cat} className="text-center">
                <h3 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-6" style={{ color:'var(--c-accent-70)' }}>
                  <span className="h-px w-8 hidden sm:block" style={{ background:'var(--c-accent-bg-md)' }}/>{CAT_ICON[cat]||'📦'} {cat}
                  <span className="h-px w-8 hidden sm:block" style={{ background:'var(--c-accent-bg-md)' }}/>
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {catSkills.map(sk => {
                    const match = getSkillIcon(sk.name||sk);
                    return (
                      <span key={sk._id||sk} className="inline-flex items-center gap-2 font-semibold"
                        style={{ padding:'10px 20px', borderRadius:'999px', background:'var(--c-surface)', border:'1.5px solid var(--c-accent-bg-lg)', color:'var(--c-text)', fontFamily:'var(--font-sans)', fontSize:'14px', boxShadow:'4px 5px 4px 3px rgba(6,182,212,.12)' }}>
                        {match ? (match.type==='svg' ? <img src={match.src} alt={sk.name||sk} width={18} height={18} style={{ objectFit:'contain',flexShrink:0 }} onError={e=>{e.currentTarget.style.display='none'}}/> : <match.Icon size={16} style={{ color:match.color,flexShrink:0 }}/>) : <span style={{ width:8,height:8,borderRadius:'50%',background:'var(--c-accent)',flexShrink:0,display:'inline-block'}}/>}
                        {sk.name||sk}
                      </span>
                    );
                  })}
                </div>
              </div>
            )) : (
              <div className="flex flex-wrap justify-center gap-3">
                {['React','Node.js','MongoDB','Tailwind CSS','JavaScript','Python','Cisco','Git'].map(s => <span key={s} className="tech-badge">{s}</span>)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding:'80px 16px', background:'var(--c-section)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading icon={FolderKanban} title="Recent Projects" accent="#06b6d4" to="/projects"/>
          {projects.length === 0 ? (
            <p className="text-center" style={{ color:'var(--c-text-50)' }}>No projects published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.slice(0,6).map(proj => (
                <Link key={proj._id} to="/projects" className="reveal-scale card-glow rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1" style={{ textDecoration:'none', background:'var(--c-surface)' }}>
                  {proj.screenshots?.length > 0 ? (
                    <img src={getUploadUrl(proj.screenshots[0])} alt={proj.title} className="w-full h-40 object-cover"/>
                  ) : (
                    <div className="h-28 flex items-center justify-center" style={{ background:'linear-gradient(135deg,rgba(8,145,178,.3),rgba(34,211,238,.15))' }}>
                      <FolderKanban size={32} style={{ color:'rgba(34,211,238,.4)' }}/>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-base mb-1" style={{ color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>{proj.title}</h3>
                    <p className="text-xs line-clamp-2 flex-1" style={{ color:'var(--c-text-60)' }}>{proj.solution||proj.problemBackground||'Click to see details.'}</p>
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop:'1px solid var(--c-border-xs)' }}>
                        {proj.technologies.slice(0,3).map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded font-mono" style={{ background:'var(--c-surface-md)', color:'var(--c-accent)', border:'1px solid var(--c-border-sm)' }}>{t}</span>)}
                        {proj.technologies.length > 3 && <span className="text-[11px]" style={{ color:'var(--c-accent-50)' }}>+{proj.technologies.length-3}</span>}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NETWORKING LABS */}
      <section id="networking-labs" style={{ padding:'80px 16px', background:'var(--c-bg,linear-gradient(160deg,#06152e 0%,#0a1d4a 50%,#061230 100%))' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading icon={Network} title="Networking Labs" accent="#2dd4bf" to="/networking-labs"/>
          {labs.length === 0 ? (
            <p className="text-center" style={{ color:'var(--c-text-50)' }}>No labs published yet.</p>
          ) : (
            <div className="space-y-3">
              {labs.slice(0,5).map(lab => (
                <div key={lab._id} className="card-glow rounded-2xl overflow-hidden transition-all" style={openLab===lab._id?{borderColor:'rgba(45,212,191,.4)'}:{}}>
                  <button onClick={() => setOpenLab(p => p===lab._id ? null : lab._id)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(45,212,191,.12)', border:'1px solid rgba(45,212,191,.25)' }}>
                        <Network size={16} style={{ color:'#2dd4bf' }}/>
                      </div>
                      <span className="font-bold text-sm truncate" style={{ color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>{lab.title}</span>
                    </div>
                    {openLab===lab._id ? <ChevronUp size={16} style={{ color:'#2dd4bf' }}/> : <ChevronDown size={16} style={{ color:'var(--c-text-50)' }}/>}
                  </button>
                  {openLab===lab._id && (
                    <div className="px-5 pb-5" style={{ borderTop:'1px solid rgba(45,212,191,.15)' }}>
                      {lab.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                          {lab.technologies.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded font-mono" style={{ background:'rgba(45,212,191,.1)', color:'#2dd4bf', border:'1px solid rgba(45,212,191,.2)' }}>{t}</span>)}
                        </div>
                      )}
                      {lab.explanations && <p className="text-sm leading-relaxed mt-2" style={{ color:'var(--c-text-70)' }}>{lab.explanations}</p>}
                      <Link to="/networking-labs" className="inline-flex items-center gap-1 text-xs font-bold mt-3" style={{ color:'#2dd4bf', fontFamily:'var(--font-sans)' }}>
                        View full lab <ArrowRight size={12}/>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CV */}
      <section id="cv" style={{ padding:'80px 16px', background:'var(--c-section)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading icon={FileText} title="CV / Resume" accent="#f472b6" to="/cv"/>
          <div className="reveal-scale flex flex-col sm:flex-row items-center gap-8 card-glow rounded-3xl p-8">
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2" style={{ color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>{cv ? cv.name : 'My Curriculum Vitae'}</h3>
              <p className="text-sm mb-6" style={{ color:'var(--c-text-60)' }}>View my full qualifications, education, experience and certifications.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/cv" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background:'linear-gradient(135deg,#0891b2,#22d3ee)', color:'#fff', boxShadow:'0 4px 14px rgba(34,211,238,.35)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>
                  <ExternalLink size={14}/> View CV
                </Link>
                {cv && (
                  <a href={getUploadUrl(cv.path||`/uploads/${cv.filename}`)} download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                    style={{ background:'var(--c-surface-md)', border:'1px solid var(--c-border-surf)', color:'var(--c-text-85)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>
                    <Download size={14}/> Download
                  </a>
                )}
              </div>
            </div>
            <div style={{ width:'80px', height:'80px', borderRadius:'20px', background:'rgba(244,114,182,.1)', border:'1px solid rgba(244,114,182,.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FileText size={36} style={{ color:'#f472b6' }}/>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:'80px 16px', background:'var(--c-bg,linear-gradient(160deg,#06152e 0%,#0a1d4a 50%,#061230 100%))' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={Phone} title="Contact Me" accent="#4ade80" to="/contact"/>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="font-bold text-lg mb-5" style={{ color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>Contact Information</h3>
              <div className="flex flex-col gap-4 mb-8">
                {profile?.email && <div className="flex items-baseline gap-3"><span style={{ color:'var(--c-text)', fontFamily:'var(--font-mono)', fontWeight:700, minWidth:'80px' }}>Email:</span><a href={`mailto:${profile.email}`} style={{ color:'var(--c-accent)', fontFamily:'var(--font-mono)', fontSize:'14px', wordBreak:'break-all' }}>{profile.email}</a></div>}
                {profile?.phone && <div className="flex items-baseline gap-3"><span style={{ color:'var(--c-text)', fontFamily:'var(--font-mono)', fontWeight:700, minWidth:'80px' }}>Phone:</span><a href={`tel:${profile.phone}`} style={{ color:'var(--c-accent)', fontFamily:'var(--font-mono)', fontSize:'14px' }}>{profile.phone}</a></div>}
                {profile?.location && <div className="flex items-baseline gap-3"><span style={{ color:'var(--c-text)', fontFamily:'var(--font-mono)', fontWeight:700, minWidth:'80px' }}>Location:</span><span style={{ color:'var(--c-accent)', fontFamily:'var(--font-mono)', fontSize:'14px' }}>{profile.location}</span></div>}
              </div>
              <SocialConnect compact/>
            </div>
            <div className="reveal-right delay-200 rounded-3xl p-7" style={{ background:'var(--c-surface)', border:'1px solid var(--c-border)', boxShadow:'0 8px 40px rgba(0,0,0,.2)' }}>
              {status==='success' ? (
                <div className="flex flex-col items-center py-8 text-center gap-4">
                  <CheckCircle2 size={40} style={{ color:'#10b981' }}/>
                  <h4 className="font-bold text-lg" style={{ color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>Message Sent!</h4>
                  <p style={{ color:'var(--c-text-50)', fontSize:'14px' }}>I'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} noValidate className="space-y-4">
                  <h4 className="font-bold text-base mb-4" style={{ color:'var(--c-text)', fontFamily:'var(--font-sans)' }}>Send a Message</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{n:'name',l:'Your Name',p:'Alebie Ayalew'},{n:'email',l:'Email',t:'email',p:'you@example.com'}].map(({n,l,t='text',p}) => (
                      <div key={n}>
                        <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'var(--c-text-50)' }}>{l}</label>
                        <input type={t} name={n} placeholder={p} value={form[n]} onChange={e=>setForm(f=>({...f,[n]:e.target.value}))} required
                          style={{ width:'100%', padding:'11px 14px', background:'var(--c-input)', border:'1px solid var(--c-border)', borderRadius:'12px', color:'var(--c-text)', fontSize:'14px', fontFamily:'var(--font-mono)', outline:'none' }}
                          onFocus={e=>(e.target.style.borderColor='var(--c-border-focus)')} onBlur={e=>(e.target.style.borderColor='var(--c-border)')}/>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'var(--c-text-50)' }}>Subject</label>
                    <input type="text" name="subject" placeholder="What is this about?" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                      style={{ width:'100%', padding:'11px 14px', background:'var(--c-input)', border:'1px solid var(--c-border)', borderRadius:'12px', color:'var(--c-text)', fontSize:'14px', fontFamily:'var(--font-mono)', outline:'none' }}
                      onFocus={e=>(e.target.style.borderColor='var(--c-border-focus)')} onBlur={e=>(e.target.style.borderColor='var(--c-border)')}/>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'var(--c-text-50)' }}>Message <span style={{ color:'var(--c-accent)' }}>*</span></label>
                    <textarea name="message" rows={4} placeholder="Tell me about your project..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} required
                      style={{ width:'100%', padding:'12px 14px', background:'var(--c-input)', border:'1px solid var(--c-border)', borderRadius:'14px', color:'var(--c-text)', fontSize:'14px', fontFamily:'var(--font-mono)', outline:'none', resize:'vertical' }}
                      onFocus={e=>(e.target.style.borderColor='var(--c-border-focus)')} onBlur={e=>(e.target.style.borderColor='var(--c-border)')}/>
                  </div>
                  {status==='error' && <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm" style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', color:'#fca5a5' }}><AlertCircle size={15} className="flex-shrink-0 mt-0.5"/> {errMsg}</div>}
                  <button type="submit" disabled={status==='sending'||!form.name.trim()||!form.email.trim()||!form.message.trim()}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px 24px', borderRadius:'14px',
                      background:status==='sending'?'rgba(34,211,238,.3)':'linear-gradient(135deg,#0891b2,#22d3ee)',
                      color:'#fff', fontWeight:700, fontSize:'14px', fontFamily:'var(--font-sans)', border:'none',
                      cursor:status==='sending'?'not-allowed':'pointer', boxShadow:'0 6px 24px rgba(34,211,238,.25)' }}>
                    {status==='sending'?<><Loader2 size={16} className="animate-spin"/> Sending...</>:<><Send size={15}/> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
