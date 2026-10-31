import React, { useEffect, useState, useCallback } from 'react';
import { adm } from '../../services/api';
import {
  Mail, MailOpen, Trash2, Clock, CheckCircle2,
  AlertCircle, ChevronDown, ChevronUp, RefreshCw, Inbox,
} from 'lucide-react';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '';

const Messages = () => {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adm.getMessages();
      setItems(data);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (msg) => {
    if (expanded === msg._id) { setExpanded(null); return; }
    setExpanded(msg._id);
    if (!msg.isRead) {
      try {
        await adm.markRead(msg._id);
        setItems(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch (_) {}
    }
  };

  const markRead = async (e, id) => {
    e.stopPropagation();
    try {
      await adm.markRead(id);
      setItems(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (_) {}
  };

  const del = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await adm.deleteMessage(id);
      if (expanded === id) setExpanded(null);
      setItems(prev => prev.filter(m => m._id !== id));
    } catch (_) {}
  };

  const filtered = items.filter(m =>
    filter === 'unread' ? !m.isRead : filter === 'read' ? m.isRead : true
  );
  const unreadCount = items.filter(m => !m.isRead).length;

  return (
    <div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Messages</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            Inbox from your portfolio contact form
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-bold text-[11px]">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <button
          onClick={load}
          title="Refresh"
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors shadow-xs"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── Filter pills ───────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          ['all',    `All (${items.length})`],
          ['unread', `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`],
          ['read',   `Read (${items.length - unreadCount})`],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filter === val
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Loading skeletons ──────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <Inbox size={28} className="text-slate-300" />
          </div>
          <p className="font-bold text-slate-700 text-sm">
            {filter === 'unread' ? 'No unread messages' : filter === 'read' ? 'No read messages' : 'No messages yet'}
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Messages submitted through your portfolio contact form will appear here.
          </p>
        </div>
      )}

      {/* ── Message list ───────────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(msg => {
            const isOpen = expanded === msg._id;
            return (
              <div key={msg._id}>

                {/* ── Row ── */}
                <div
                  onClick={() => toggle(msg)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${
                    !msg.isRead
                      ? 'bg-blue-50/60 border-blue-100 hover:border-blue-200'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {msg.isRead
                      ? <MailOpen size={18} className="text-slate-300" />
                      : <Mail     size={18} className="text-blue-500" />
                    }
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-sm truncate ${!msg.isRead ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono truncate hidden sm:block">
                        {msg.email}
                      </span>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    {msg.subject && (
                      <p className="text-xs font-semibold text-slate-600 truncate mb-0.5">{msg.subject}</p>
                    )}
                    <p className="text-xs text-slate-400 truncate">{msg.message}</p>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 hidden sm:flex">
                      <Clock size={10} /> {fmtDate(msg.createdAt)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {!msg.isRead && (
                        <button
                          onClick={(e) => markRead(e, msg._id)}
                          title="Mark as read"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <CheckCircle2 size={11} /> Mark read
                        </button>
                      )}
                      <button
                        onClick={(e) => del(e, msg._id)}
                        title="Delete"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isOpen
                      ? <ChevronUp   size={15} className="text-slate-400" />
                      : <ChevronDown size={15} className="text-slate-300" />
                    }
                  </div>
                </div>

                {/* ── Expanded detail panel ── */}
                {isOpen && (
                  <div className="mx-2 mb-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">From</p>
                        <p className="text-sm font-semibold text-slate-800">{msg.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-sm text-blue-600 hover:underline font-medium break-all"
                        >
                          {msg.email}
                        </a>
                      </div>
                      {msg.subject && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subject</p>
                          <p className="text-sm font-semibold text-slate-800">{msg.subject}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Received</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={11} /> {fmtDate(msg.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Status</p>
                        {msg.isRead
                          ? <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                              <CheckCircle2 size={13} className="text-emerald-400" /> Read
                            </span>
                          : <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                              <AlertCircle size={13} /> Unread
                            </span>
                        }
                      </div>
                    </div>

                    {/* Message body */}
                    <div className="mb-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Message</p>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono min-h-[60px]">
                        {msg.message}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                      {!msg.isRead && (
                        <button
                          onClick={(e) => markRead(e, msg._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 size={13} /> Mark as Read
                        </button>
                      )}
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your message')}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors no-underline"
                      >
                        <Mail size={13} /> Reply via Email
                      </a>
                      <button
                        onClick={(e) => del(e, msg._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 size={13} /> Delete Message
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;
