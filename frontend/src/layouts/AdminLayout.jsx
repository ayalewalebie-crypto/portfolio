import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adm } from '../services/api';
import {
  LayoutDashboard, FolderKanban, Code2, GraduationCap, Briefcase,
  Award, Trophy, Network, FileText, Mail, Settings,
  LogOut, ExternalLink, Menu, X, Loader2, ChevronRight,
} from 'lucide-react';

const NAV = [
  { label: 'Overview',        path: '/admin',                icon: LayoutDashboard, color: 'text-purple-400' },
  { label: 'Projects',        path: '/admin/projects',       icon: FolderKanban,    color: 'text-purple-400' },
  { label: 'Skills',          path: '/admin/skills',         icon: Code2,           color: 'text-blue-400'   },
  { label: 'Education',       path: '/admin/education',      icon: GraduationCap,   color: 'text-emerald-400'},
  { label: 'Experience',      path: '/admin/experience',     icon: Briefcase,       color: 'text-sky-400'    },
  { label: 'Certifications',  path: '/admin/certifications', icon: Award,           color: 'text-amber-400'  },
  { label: 'Achievements',    path: '/admin/achievements',   icon: Trophy,          color: 'text-orange-400' },
  { label: 'Networking Labs', path: '/admin/networking-labs',icon: Network,         color: 'text-teal-400'   },
  { label: 'CV / Documents',  path: '/admin/documents',      icon: FileText,        color: 'text-pink-400'   },
  { label: 'Messages',        path: '/admin/messages',       icon: Mail,            color: 'text-purple-400' },
  { label: 'Settings',        path: '/admin/settings',       icon: Settings,        color: 'text-slate-400'  },
];

const AdminLayout = () => {
  const { admin, loading, logout } = useAuth();
  const location  = useLocation();
  const [open, setOpen]           = useState(false);
  const [profile, setProfile]     = useState(null);
  const [unread, setUnread]       = useState(0);

  useEffect(() => {
    if (admin) {
      adm.getProfile()
        .then(({ data }) => { if (data?._id) setProfile(data); })
        .catch(() => {});
      adm.getMessages()
        .then(({ data }) => setUnread(data.filter(m => !m.isRead).length))
        .catch(() => {});
    }
  }, [admin]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060d28' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)' }}>
          <Loader2 size={26} className="text-white animate-spin" />
        </div>
        <p className="text-slate-400 text-sm font-medium">Verifying session…</p>
      </div>
    </div>
  );

  if (!admin) return <Navigate to="/admin/login" replace />;

  const currentPage = NAV.find(n => n.path === location.pathname)?.label || 'Admin';

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#f5f0ff', fontFamily: 'var(--font-sans,Inter,sans-serif)' }}
    >
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50 w-[240px] flex flex-col
          transition-transform duration-200 lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(180deg,#060d28 0%,#071430 60%,#060d28 100%)',
          borderRight: '1px solid rgba(168,85,247,.15)',
        }}
      >
        {/* Brand */}
        <div
          className="h-[66px] px-5 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto.startsWith('http')
                    ? profile.profilePhoto
                    : `http://localhost:5000${profile.profilePhoto}`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-extrabold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)' }}
                >
                  {(profile?.name || admin?.name || 'A')[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-none tracking-tight truncate">
                {profile?.name || admin?.name || 'Admin'}
              </p>
              <p className="text-slate-500 text-[10px] mt-0.5 uppercase tracking-widest">Portfolio CMS</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-slate-500 hover:text-white p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, path, icon: Icon, color }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg,rgba(124,58,237,.35),rgba(168,85,247,.2))',
                  boxShadow:  '0 0 0 1px rgba(124,58,237,.3)',
                } : {}}
              >
                <Icon
                  size={16}
                  className={`flex-shrink-0 transition-colors ${active ? 'text-purple-300' : color + ' group-hover:text-white'}`}
                />
                <span className="flex-1 text-[13px]">{label}</span>
                {label === 'Messages' && unread > 0 && (
                  <span style={{
                    fontSize: '10px', fontWeight: 800, lineHeight: 1,
                    padding: '2px 6px', borderRadius: '999px',
                    background: active ? 'rgba(168,85,247,.3)' : '#a855f7',
                    color: active ? '#a855f7' : '#fff',
                    flexShrink: 0,
                  }}>
                    {unread}
                  </span>
                )}
                {active && <ChevronRight size={13} className="text-purple-400 flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* View site */}
        <div className="px-3 py-2" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={13} />
            View Live Portfolio
          </Link>
        </div>

        {/* Logout */}
        <div
          className="p-3 flex items-center justify-center"
          style={{ borderTop: '1px solid rgba(255,255,255,.06)', background: 'rgba(0,0,0,.2)' }}
        >
          <button
            onClick={logout}
            title="Sign out"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-semibold w-full justify-center"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header
          className="h-[66px] flex items-center justify-between px-5 sm:px-7 flex-shrink-0 sticky top-0 z-30"
          style={{
            background: 'rgba(255,255,255,.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(226,232,240,.8)',
            boxShadow: '0 2px 16px rgba(124,58,237,.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">{currentPage}</h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">Portfolio CMS</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{
                background: 'rgba(16,185,129,.08)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,.2)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-200 text-xs font-semibold transition-all shadow-xs"
            >
              <ExternalLink size={13} /> Preview
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 sm:p-7 lg:p-9 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
