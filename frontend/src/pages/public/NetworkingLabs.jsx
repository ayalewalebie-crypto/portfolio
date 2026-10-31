import React, { useEffect, useState } from 'react';
import { pub } from '../../services/api';
import { Network, Star, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

const NetworkingLabs = () => {
  const [labs,    setLabs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(null);

  useEffect(() => { pub.getLabs().then(({data}) => setLabs(data)).finally(() => setLoading(false)); }, []);
  const toggle = (id) => setOpen(p => p === id ? null : id);

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* Banner */}
      <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8" style={{background:'var(--section-bg)'}}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
            style={{background:'radial-gradient(circle,rgba(168,85,247,.25) 0%,transparent 70%)', filter:'blur(40px)'}}/>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3" style={{color:'rgba(45,212,191,.7)', fontSize:'12px', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase'}}>
            <Network size={13}/> Networking
          </div>
          <h1 className="font-extrabold tracking-tight mb-2" style={{fontSize:'clamp(2rem,5vw,3.2rem)', color:'var(--text-primary)', fontFamily:'var(--font-sans)'}}>
            Networking <strong style={{color:'#2dd4bf'}}>Labs</strong>
          </h1>
          <p style={{color:'var(--text-dimmer)', fontSize:'14px'}}>
            Cisco Packet Tracer simulations, campus designs, VLANs, and routing configurations.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4">{Array.from({length:3}).map((_,i) => <div key={i} className="h-24 rounded-2xl shimmer"/>)}</div>
        ) : labs.length === 0 ? (
          <div className="text-center py-24">
            <Network size={48} style={{color:'rgba(45,212,191,.2)', margin:'0 auto 12px'}}/>
            <p style={{color:'var(--text-dimmest)'}}>No labs published yet — check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {labs.map(lab => (
              <div key={lab._id} className="card-glow rounded-2xl overflow-hidden transition-all"
                style={open === lab._id ? {borderColor:'rgba(45,212,191,.4)'} : {}}>
                <button onClick={() => toggle(lab._id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{background:'var(--bg-teal-medium)', border:'1px solid rgba(45,212,191,.25)'}}>
                      <Network size={18} style={{color:'#2dd4bf'}}/>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-base" style={{color:'var(--text-primary)', fontFamily:'var(--font-sans)'}}>{lab.title}</h2>
                        {lab.isFeatured && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{background:'rgba(251,191,36,.1)', color:'#fbbf24', border:'1px solid rgba(251,191,36,.3)'}}>
                            <Star size={8} fill="currentColor"/> Featured
                          </span>
                        )}
                      </div>
                      {lab.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {lab.technologies.slice(0,5).map(t => (
                            <span key={t} className="text-[11px] px-2 py-0.5 rounded-lg font-mono"
                              style={{background:'var(--bg-teal-medium)', color:'#2dd4bf', border:'1px solid rgba(45,212,191,.2)'}}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 transition-colors"
                    style={{background: open===lab._id ? 'var(--bg-teal-medium)' : 'var(--bg-surface-hover)', color: open===lab._id ? '#2dd4bf' : 'var(--text-dimmest)'}}>
                    {open === lab._id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  </div>
                </button>

                {open === lab._id && (
                  <div className="px-6 py-6 space-y-6" style={{borderTop:'1px solid var(--border-accent3)'}}>
                    {lab.topologyImage && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'rgba(45,212,191,.6)'}}>— Network Topology</p>
                        <div className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(45,212,191,.2)'}}>
                          <img src={lab.topologyImage} alt="Topology" className="w-full object-contain max-h-96"/>
                        </div>
                      </div>
                    )}
                    {lab.objectives?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'rgba(45,212,191,.6)'}}>— Objectives</p>
                        <div className="space-y-2">
                          {lab.objectives.map((o,i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                              style={{background:'var(--bg-teal-soft)', border:'1px solid rgba(45,212,191,.12)'}}>
                              <span className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                                style={{background:'var(--bg-teal-medium)', color:'#2dd4bf'}}>{i+1}</span>
                              <p className="text-sm" style={{color:'var(--text-secondary)'}}>{o}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {lab.explanations && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'rgba(45,212,191,.6)'}}>— Overview</p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
                          style={{color:'var(--text-muted)', background:'rgba(255,255,255,.03)', border:'1px solid rgba(45,212,191,.12)'}}>
                          {lab.explanations}
                        </p>
                      </div>
                    )}
                    {lab.addressingTable?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'rgba(45,212,191,.6)'}}>— Addressing Table</p>
                        <div className="overflow-x-auto rounded-xl" style={{border:'1px solid rgba(45,212,191,.2)'}}>
                          <table className="w-full text-xs">
                            <thead>
                              <tr style={{background:'var(--bg-teal-medium)', color:'var(--text-muted)'}}>
                                {['Device','Interface','IP Address','Subnet Mask','Default Gateway'].map(h => (
                                  <th key={h} className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {lab.addressingTable.map((row,i) => (
                                <tr key={i} style={{borderTop:'1px solid rgba(45,212,191,.08)'}}>
                                  <td className="px-4 py-3 font-mono font-bold" style={{color:'var(--text-primary)'}}>{row.device}</td>
                                  <td className="px-4 py-3 font-mono" style={{color:'var(--text-muted)'}}>{row.interface}</td>
                                  <td className="px-4 py-3 font-mono font-semibold" style={{color:'#2dd4bf'}}>{row.ipAddress}</td>
                                  <td className="px-4 py-3 font-mono" style={{color:'var(--text-dimmest)'}}>{row.subnetMask}</td>
                                  <td className="px-4 py-3 font-mono" style={{color:'var(--text-dimmest)'}}>{row.defaultGateway}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {lab.configurations?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'rgba(45,212,191,.6)'}}>— Device Configurations</p>
                        <div className="space-y-4">
                          {lab.configurations.map((cfg,i) => (
                            <div key={i} className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(45,212,191,.2)'}}>
                              <div className="px-4 py-2.5 flex items-center gap-3" style={{background:'var(--bg-code)'}}>
                                <div className="flex gap-1.5">
                                  <span className="w-3 h-3 rounded-full bg-rose-500"/>
                                  <span className="w-3 h-3 rounded-full bg-amber-400"/>
                                  <span className="w-3 h-3 rounded-full bg-emerald-500"/>
                                </div>
                                <Terminal size={12} style={{color:'rgba(45,212,191,.6)'}}/>
                                <span className="text-xs font-mono font-bold" style={{color:'var(--text-muted)'}}>{cfg.device}</span>
                              </div>
                              <pre className="p-5 overflow-x-auto text-xs font-mono leading-relaxed"
                                style={{background:'var(--bg-code)', color:'#2dd4bf'}}>{cfg.config}</pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(lab.results || lab.lessonsLearned) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lab.results && (
                          <div className="rounded-2xl p-5" style={{background:'rgba(52,211,153,.06)', border:'1px solid rgba(52,211,153,.2)'}}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'rgba(52,211,153,.7)'}}>— Results</p>
                            <p className="text-sm leading-relaxed" style={{color:'var(--text-muted)'}}>{lab.results}</p>
                          </div>
                        )}
                        {lab.lessonsLearned && (
                          <div className="rounded-2xl p-5" style={{background:'var(--bg-accent-soft)', border:'1px solid var(--border-accent3)'}}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:'var(--text-accent-muted)'}}>— Lessons Learned</p>
                            <p className="text-sm leading-relaxed" style={{color:'var(--text-muted)'}}>{lab.lessonsLearned}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkingLabs;
