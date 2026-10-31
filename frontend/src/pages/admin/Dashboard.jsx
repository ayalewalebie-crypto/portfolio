import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adm } from '../../services/api';
import {
  FolderKanban, Code2, Award, Trophy, Network,
  GraduationCap, Briefcase, ExternalLink,
  Sparkles, ArrowRight, TrendingUp, Mail,
} from 'lucide-react';

const STAT_CARDS = [
  { key: 'projectsCount',       label: 'Projects',        icon: FolderKanban,  link: '/admin/projects',        from: 'from-cyan-500', to: 'to-cyan-600'  },
  { key: 'skillsCount',         label: 'Skills',           icon: Code2,         link: '/admin/skills',          from: 'from-cyan-500', to: 'to-cyan-600'  },
  { key: 'educationCount',      label: 'Education',        icon: GraduationCap, link: '/admin/education',       from: 'from-emerald-500',to: 'to-teal-600'    },
  { key: 'experienceCount',     label: 'Experience',       icon: Briefcase,     link: '/admin/experience',      from: 'from-sky-500',    to: 'to-blue-600'    },
  { key: 'certificationsCount', label: 'Certifications',   icon: Award,         link: '/admin/certifications',  from: 'from-amber-500',  to: 'to-orange-500'  },
  { key: 'achievementsCount',   label: 'Achievements',     icon: Trophy,        link: '/admin/achievements',    from: 'from-orange-500', to: 'to-rose-500'    },
  { key: 'labsCount',           label: 'Networking Labs',  icon: Network,       link: '/admin/networking-labs', from: 'from-teal-500',   to: 'to-emerald-600' },
  { key: 'messagesCount',       label: 'Messages',         icon: Mail,          link: '/admin/messages',        from: 'from-cyan-400',   to: 'to-sky-500',  unreadKey: 'unreadCount' },
];

const QUICK_ACTIONS = [
  { label: 'Add Project',       to: '/admin/projects',        from: 'from-cyan-500', to_: 'to-cyan-600'  },
  { label: 'Add Skill',         to: '/admin/skills',          from: 'from-cyan-500', to_: 'to-cyan-600'  },
  { label: 'Add Certificate',   to: '/admin/certifications',  from: 'from-amber-500',  to_: 'to-orange-500'  },
  { label: 'Add Lab',           to: '/admin/networking-labs', from: 'from-teal-500',   to_: 'to-emerald-600' },
  { label: 'Upload CV',         to: '/admin/documents',       from: 'from-rose-500',   to_: 'to-pink-600'    },
  { label: 'Edit Profile',      to: '/admin/settings',        from: 'from-slate-500',  to_: 'to-slate-700'   },
];

const Dashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adm.stats()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-7">

      {/* ── Welcome banner ──────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl p-7 sm:p-9 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0e7490 0%,#0891b2 60%,#06b6d4 100%)' }}
      >
        {/* Background decoration */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,rgba(255,255,255,.4) 0%,transparent 70%)' }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-admin" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-admin)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-bold mb-4">
              <Sparkles size={12} className="text-amber-300" />
              Portfolio Control Centre
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, Admin! 👋</h2>
            <p className="text-cyan-200 text-sm mt-1 max-w-md">
              Here's a live overview of everything on your portfolio.
            </p>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-cyan-700 font-bold text-sm hover:bg-cyan-50 transition-colors shadow-sm"
            >
              <ExternalLink size={14} /> Live Site
            </Link>
            <Link
              to="/admin/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition-colors border border-white/20"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Mini stat strip */}
        {stats && (
          <div className="relative z-10 grid grid-cols-3 gap-3 mt-7 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,.15)' }}>
            {[
              { label: 'Projects',      val: stats.projectsCount      },
              { label: 'Skills',        val: stats.skillsCount        },
              { label: 'Certificates',  val: stats.certificationsCount},
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{val ?? '—'}</p>
                <p className="text-cyan-300 text-[11px] mt-0.5 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Stat cards grid ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ key, label, icon: Icon, link, from, to, unreadKey }) => (
            <Link
              key={key}
              to={link}
              className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shadow-sm`}>
                  <Icon size={19} className="text-white" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-2xl font-extrabold text-slate-800 tabular-nums">
                    {stats?.[key] ?? '—'}
                  </span>
                  {unreadKey && stats?.[unreadKey] > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                      {stats[unreadKey]} unread
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 group-hover:text-cyan-600 transition-colors">{label}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp size={10} /> Manage →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Quick actions ──────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-slate-900 text-base">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ label, to, from, to_ }) => (
              <Link
                key={label}
                to={to}
                className="group relative overflow-hidden rounded-2xl p-4 text-white font-bold text-xs shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{ background: `linear-gradient(135deg,var(--tw-gradient-stops))` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${from} ${to_}`}
                  style={{ opacity: 1 }}
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span>{label}</span>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
      </div>

    </div>
  );
};

export default Dashboard;
