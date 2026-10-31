import React, { useEffect, useState } from 'react';
import { pub } from '../../services/api';
import { Calendar } from 'lucide-react';
import SocialConnect from '../../components/public/SocialConnect';

const fmtYear = (d) => d ? new Date(d).getFullYear() : '';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

const About = () => {
  const [profile,   setProfile]   = useState(null);
  const [education, setEducation] = useState([]);
  const [experience,setExperience]= useState([]);

  useEffect(() => {
    Promise.allSettled([
      pub.getProfile(),
      pub.getEducation(),
      pub.getExperience(),
    ]).then(([p, ed, ex]) => {
      if (p.status  === 'fulfilled') setProfile(p.value.data);
      if (ed.status === 'fulfilled') setEducation(ed.value.data);
      if (ex.status === 'fulfilled') setExperience(ex.value.data);
    });
  }, []);

  const photoSrc = profile?.profilePhoto
    ? (profile.profilePhoto.startsWith('http')
        ? profile.profilePhoto
        : `http://localhost:5000${profile.profilePhoto}`)
    : null;

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Banner */}
      <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'var(--bg-section)' }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(168,85,247,.2) 0%,transparent 70%)', filter: 'blur(40px)', opacity: .25 }} />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-accent-muted)' }}>— About Me</p>
          <h1 className="font-extrabold tracking-tight mb-2"
            style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
            Know Who <strong style={{ color: 'var(--text-accent)' }}>I'M</strong>
          </h1>
          <p style={{ color: 'var(--text-dimmer)', fontSize: '14px' }}>
            Background, education, and work experience.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Photo + quick info */}
          <div className="flex flex-col items-center gap-6">
            {photoSrc ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', transform: 'scale(1.15)' }} />
                <img src={photoSrc} alt={profile?.name || 'Profile'}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 object-cover avatar-glow" />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,rgba(168,85,247,.3),rgba(124,58,237,.15))', border: '2px solid rgba(168,85,247,.3)' }}>
                <span className="text-5xl font-extrabold" style={{ color: 'var(--text-accent)' }}>
                  {profile?.name?.[0] || 'A'}
                </span>
              </div>
            )}

            {/* Quick info card */}
            <div className="card-glow rounded-2xl p-5 w-full text-sm space-y-2.5">
              {profile?.name && (
                <div className="flex justify-between gap-2">
                  <span style={{ color: 'var(--text-accent-dim)' }}>Name</span>
                  <span className="font-semibold text-right" style={{ color: 'var(--text-primary)' }}>{profile.name}</span>
                </div>
              )}
              {profile?.title && (
                <div className="flex justify-between gap-2">
                  <span style={{ color: 'var(--text-accent-dim)' }}>Role</span>
                  <span className="font-semibold text-right" style={{ color: 'var(--text-primary)' }}>{profile.title}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex justify-between gap-2">
                  <span style={{ color: 'var(--text-accent-dim)' }}>Location</span>
                  <span className="font-semibold text-right" style={{ color: 'var(--text-primary)' }}>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex justify-between gap-2">
                  <span style={{ color: 'var(--text-accent-dim)' }}>Email</span>
                  <a href={`mailto:${profile.email}`}
                    className="font-semibold text-right truncate"
                    style={{ color: 'var(--text-accent)' }}>
                    {profile.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Bio + Education + Experience */}
          <div className="lg:col-span-2 space-y-8">

            {/* Bio */}
            <div>
              <h2 className="font-bold text-lg mb-4"
                style={{ color: 'var(--text-accent)', fontFamily: 'var(--font-sans)' }}>
                LET ME <span style={{ color: 'var(--text-primary)' }}>INTRODUCE</span> MYSELF
              </h2>

              {profile?.about ? (
                /* Render the bio from DB — highlight key phrases in purple */
                <div className="space-y-4 text-base leading-loose"
                  style={{ color: 'var(--text-secondary)' }}>
                  {profile.about.split('\n\n').filter(p => p.trim()).map((para, i) => {
                    // Hobbies section — render emoji bullet lines specially
                    if (para.includes('🎮') || para.includes('🎧') || para.includes('🌍')) {
                      const lines = para.split('\n').filter(l => l.trim());
                      return (
                        <div key={i}>
                          {lines.map((line, j) => {
                            const isActivity = line.trim().startsWith('Playing') ||
                                               line.trim().startsWith('Listening') ||
                                               line.trim().startsWith('Traveling');
                            if (isActivity) {
                              return (
                                <div key={j} className="flex items-center gap-3 py-1.5">
                                  <span className="text-xl">{line.match(/[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu)?.[0]}</span>
                                  <span style={{ color: 'var(--text-secondary)' }}>
                                    {line.replace(/[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu, '').replace(/^\s+/, '')}
                                  </span>
                                </div>
                              );
                            }
                            return <p key={j} style={{ color: 'var(--text-secondary)' }}>{line}</p>;
                          })}
                        </div>
                      );
                    }
                    // Regular paragraph with keyword highlights
                    // Use class-based highlights so CSS vars apply in both themes
                    return (
                      <p key={i} className="bio-para"
                        dangerouslySetInnerHTML={{
                          __html: para
                            .replace(/Bahir Dar University/g,   '<strong class="bio-highlight">Bahir Dar University</strong>')
                            .replace(/CCNA 1 and CCNA 2/g,      '<strong class="bio-highlight">CCNA 1 and CCNA 2</strong>')
                            .replace(/React|Node\.js|MongoDB|Express\.js/g, m => `<strong class="bio-highlight-2">${m}</strong>`)
                            .replace(/software development,? network administration,? wireless networking,? and intelligent systems/gi,
                              '<strong class="bio-highlight">software development, network administration, wireless networking, and intelligent systems</strong>')
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                /* Fallback when DB is empty */
                <div className="space-y-4 text-base leading-loose"
                  style={{ color: 'var(--text-secondary)' }}>
                  <p>
                    I am an Information Systems student at{' '}
                    <strong style={{ color: 'var(--text-accent)' }}>Bahir Dar University, Ethiopia</strong>,
                    passionate about software development, computer networking, artificial intelligence,
                    and emerging technologies.
                  </p>
                  <p>
                    I have completed <strong style={{ color: 'var(--text-accent)' }}>CCNA 1 and CCNA 2 training</strong>,
                    gaining hands-on experience in network configuration, switching, routing, VLANs,
                    IP addressing, subnetting, and troubleshooting.
                  </p>
                  <p>
                    My goal is to grow into a skilled IT professional specialising in{' '}
                    <strong style={{ color: 'var(--text-accent)' }}>software development, network administration,
                    wireless networking, and intelligent systems</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Education */}
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-widest"
                style={{ color: 'var(--text-accent-muted)' }}>— Education</h3>
              <div className="space-y-3">
                {education.length > 0 ? education.map(edu => (
                  <div key={edu._id} className="card-glow rounded-xl p-5 flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ background: '#a855f7', boxShadow: '0 0 8px rgba(168,85,247,.6)' }} />
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                        {edu.degree}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-accent)' }}>{edu.institution}</p>
                      {edu.location && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-dimmest)' }}>{edu.location}</p>
                      )}
                      <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-date)' }}>
                        {fmtYear(edu.startDate)} – {edu.current ? 'Present' : fmtYear(edu.endDate)}
                      </p>
                      {edu.description && (
                        <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-dimmer)' }}>
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="card-glow rounded-xl p-5 flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ background: '#a855f7' }} />
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                        B.Sc. Information Systems
                      </p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-accent)' }}>Bahir Dar University</p>
                      <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-date)' }}>
                        2022 – Present
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h3 className="font-bold mb-4 text-sm uppercase tracking-widest"
                  style={{ color: 'var(--text-accent-muted)' }}>— Experience</h3>
                <div className="space-y-3">
                  {experience.map(exp => (
                    <div key={exp._id} className="card-glow rounded-xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <p className="font-bold text-sm"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>{exp.title}</p>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-accent)' }}>
                            {exp.company}
                            {exp.location && (
                              <span className="font-normal" style={{ color: 'var(--text-dimmest)' }}>
                                {' '}· {exp.location}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {exp.type && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: 'var(--bg-accent-medium)', color: 'var(--text-accent)', border: '1px solid var(--border-accent2)' }}>
                              {exp.type}
                            </span>
                          )}
                          <span className="text-xs font-mono flex items-center gap-1"
                            style={{ color: 'var(--text-date)' }}>
                            <Calendar size={10} />
                            {fmtDate(exp.startDate)} – {exp.current ? 'Present' : fmtDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dimmer)' }}>
                          {exp.description}
                        </p>
                      )}
                      {exp.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {exp.technologies.map(t => (
                            <span key={t} className="text-[11px] px-2 py-0.5 rounded font-mono"
                              style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-accent-muted)', border: '1px solid var(--border-accent)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Social icon circles — brand colored, react-icons ── */}
      <SocialConnect />

    </div>
  );
};

export default About;
