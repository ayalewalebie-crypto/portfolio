import React, { useEffect, useState, useCallback, useRef } from 'react';
import { adm, getUploadUrl } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import {
  FileText, Upload, Trash2, Eye, CheckCircle2, AlertCircle,
  Loader2, Image, File, FileImage, FileArchive,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtSize = (b) => {
  if (!b) return '—';
  if (b > 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024).toFixed(0)} KB`;
};
const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  : '';

const resolveUrl = (src) => {
  return getUploadUrl(src);
};

const isImage = (mimetype = '', filename = '') => {
  if (/^image\//i.test(mimetype)) return true;
  return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(filename);
};

const isPdf = (mimetype = '', filename = '') => {
  if (mimetype === 'application/pdf') return true;
  return /\.pdf$/i.test(filename);
};

// Type label → badge colour
const TYPE_COLORS = {
  CV:          'bg-cyan-50 text-cyan-700 border-purple-200',
  Achievement: 'bg-amber-50  text-amber-700  border-amber-200',
  Lab:         'bg-teal-50   text-teal-700   border-teal-200',
  Image:       'bg-sky-50    text-sky-700    border-sky-200',
  Other:       'bg-slate-50  text-slate-600  border-slate-200',
};

const FILE_TYPES = ['CV', 'Achievement', 'Lab', 'Image', 'Other'];

// File type icon
const FileIcon = ({ mimetype, filename, size = 18, className = '' }) => {
  if (isImage(mimetype, filename)) return <FileImage size={size} className={className || 'text-sky-500'} />;
  if (isPdf(mimetype, filename))   return <FileText  size={size} className={className || 'text-rose-500'} />;
  if (/word|doc/i.test(mimetype))  return <FileText  size={size} className={className || 'text-blue-500'} />;
  if (/zip|rar|archive/i.test(mimetype)) return <FileArchive size={size} className={className || 'text-amber-500'} />;
  return <File size={size} className={className || 'text-slate-400'} />;
};

// ─────────────────────────────────────────────────────────────────────────────
const Documents = () => {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileType,  setFileType]  = useState('CV');     // selected type for new upload
  const [filter,    setFilter]    = useState('All');    // list filter
  const [msg,       setMsg]       = useState({ text: '', type: '' });
  const fileRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    adm.getDocuments().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const clearMsg = () => setMsg({ text: '', type: '' });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', file.name);
    fd.append('type', fileType);
    setUploading(true); clearMsg();
    try {
      await adm.uploadDocument(fd);
      setMsg({ text: `"${file.name}" uploaded successfully as ${fileType}.`, type: 'success' });
      load();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || 'Upload failed. Max 10 MB, allowed: PDF, DOC, DOCX, PNG, JPG, WebP.', type: 'error' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const del = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await adm.deleteDocument(id);
    setMsg({ text: 'File deleted.', type: 'success' });
    load();
    setTimeout(clearMsg, 3000);
  };

  // Filtered list
  const displayed = filter === 'All' ? items : items.filter(d => d.type === filter);

  // Count per type for tab badges
  const counts = items.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Files & Documents"
        subtitle="Upload and manage all CV, images, certificates, and supporting files"
      />

      {/* ── Upload zone ─────────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-purple-300 transition-colors p-7 text-center cursor-pointer"
        onClick={() => !uploading && fileRef.current?.click()}
        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) { fileRef.current.files = e.dataTransfer.files; handleUpload({ target: { files: e.dataTransfer.files } }); } }}
        onDragOver={e => e.preventDefault()}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,.svg,.pkt"
          onChange={handleUpload}
          disabled={uploading}
        />

        <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
          {uploading
            ? <Loader2 size={24} className="text-cyan-500 animate-spin" />
            : <Upload size={24} className="text-cyan-500" />
          }
        </div>

        <h3 className="font-bold text-slate-800 mb-1">
          {uploading ? 'Uploading…' : 'Upload a file'}
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          PDF, DOC, DOCX, PNG, JPG, GIF, WebP · Max 10 MB · Drag & drop or click
        </p>

        {/* File type selector */}
        <div
          className="inline-flex items-center gap-2 flex-wrap justify-center"
          onClick={e => e.stopPropagation()}
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upload as:</span>
          {FILE_TYPES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFileType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                fileType === t
                  ? 'bg-cyan-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Status message ───────────────────────────────────────────────── */}
      {msg.text && (
        <div className={`flex items-start gap-3 p-4 rounded-xl text-sm border ${
          msg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-rose-50 border-rose-200 text-rose-600'
        }`}>
          {msg.type === 'success'
            ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
            : <AlertCircle  size={16} className="flex-shrink-0 mt-0.5" />
          }
          <span>{msg.text}</span>
          <button onClick={clearMsg} className="ml-auto text-current opacity-50 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      {!loading && items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {['All', ...FILE_TYPES].map(t => {
            const count = t === 'All' ? items.length : (counts[t] || 0);
            if (t !== 'All' && count === 0) return null;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filter === t
                    ? 'bg-cyan-600 text-white border-purple-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                }`}
              >
                {t}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  filter === t ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── File list ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No files yet"
          subtitle={filter === 'All'
            ? 'Upload your CV, images, certificates, and other documents above.'
            : `No ${filter} files uploaded yet.`
          }
        />
      ) : (
        <div className="space-y-2">
          {displayed.map(doc => {
            const url     = resolveUrl(doc.path || `/uploads/${doc.filename}`);
            const preview = isImage(doc.mimetype, doc.filename);

            return (
              <div
                key={doc._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex items-center gap-4"
              >
                {/* Thumbnail / icon */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center">
                  {preview ? (
                    <img
                      src={url}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <FileIcon mimetype={doc.mimetype} filename={doc.filename} size={22} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLORS[doc.type] || TYPE_COLORS.Other}`}>
                      {doc.type}
                    </span>
                    <span className="text-xs text-slate-400">{fmtSize(doc.size)}</span>
                    <span className="text-xs text-slate-400">{fmtDate(doc.createdAt)}</span>
                    {doc.type === 'CV' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active CV
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    title="View / Open"
                  >
                    <Eye size={15} />
                  </a>
                  <button
                    onClick={() => del(doc._id, doc.name)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Documents;
