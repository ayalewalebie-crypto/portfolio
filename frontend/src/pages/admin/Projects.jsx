import React, { useEffect, useState, useCallback, useRef } from 'react';
import { adm, getUploadUrl } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import Modal      from '../../components/admin/Modal';
import EmptyState from '../../components/admin/EmptyState';
import { Field, Input, Textarea, Checkbox } from '../../components/admin/FormField';
import { FolderKanban, Pencil, Trash2, Globe, X, Image, Upload, Loader2, AlertCircle } from 'lucide-react';

const EMPTY = {
  title:'', slug:'', solution:'', problemBackground:'', objectives:'',
  technologies:'', features:'', githubLink:'', demoLink:'',
  documentationLink:'', category:'',
  screenshots:[], isFeatured:false, isPublished:true, order:0,
};

const toArr  = (v) => Array.isArray(v) ? v : (v || '').split(',').map(s => s.trim()).filter(Boolean);
const toStr  = (v) => Array.isArray(v) ? v.join(', ') : v || '';
const toArrN = (v) => Array.isArray(v) ? v : [];

// Ensure any URL has a protocol — handles bare domains, protocol-relative, and full URLs
const safeUrl = (url) => {
  if (!url) return '#';
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('//')) return `https:${u}`;
  return `https://${u}`;
};

const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

// ── Screenshot uploader ────────────────────────────────────────────────────────
// Supports both device file upload AND optional URL entry as fallback.
const ScreenshotEditor = ({ screenshots, onChange }) => {
  const fileRef   = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');

  // Resolve display URL — handle both /uploads/... (stored) and full http://... (legacy)
  const displayUrl = (src) => {
    return getUploadUrl(src);
  };

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploadErr('');
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('image', file);
      try {
        const { data } = await adm.uploadProjectImage(fd);
        uploaded.push(data.url); // e.g. /uploads/1234-image.jpg
      } catch (e) {
        setUploadErr(e.response?.data?.message || `Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    if (uploaded.length) onChange([...screenshots, ...uploaded]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const remove = (idx) => onChange(screenshots.filter((_, i) => i !== idx));

  const moveUp   = (idx) => {
    if (idx === 0) return;
    const arr = [...screenshots];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      {/* Existing screenshots */}
      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {screenshots.map((src, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video">
              <img
                src={displayUrl(src)}
                alt={`Screenshot ${i + 1}`}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = ''; e.currentTarget.parentElement.style.background = '#f1f5f9'; }}
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button type="button" onClick={() => moveUp(i)}
                    title="Move to front"
                    className="px-2 py-1 bg-white/90 text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-white transition-colors">
                    ← Front
                  </button>
                )}
                <button type="button" onClick={() => remove(i)}
                  title="Remove"
                  className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                  <X size={13} />
                </button>
              </div>
              {/* "Card preview" badge on first */}
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 bg-cyan-600 text-white rounded-md">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone / file picker */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="relative border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-xl transition-colors cursor-pointer"
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center">
          {uploading ? (
            <>
              <Loader2 size={24} className="text-cyan-500 animate-spin" />
              <p className="text-sm font-medium text-slate-600">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Upload size={18} className="text-cyan-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, GIF, WebP · Max 10 MB each · Multiple allowed</p>
            </>
          )}
        </div>
      </div>

      {uploadErr && (
        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs">
          <AlertCircle size={13} className="flex-shrink-0" />
          {uploadErr}
        </div>
      )}

      <p className="text-[11px] text-slate-400">
        First image is used as the card preview. Hover a thumbnail to remove or reorder.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Projects = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adm.getProjects().then(({data}) => setItems(data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...item,
      technologies: toStr(item.technologies),
      features:     toStr(item.features),
      screenshots:  toArrN(item.screenshots),
    });
    setErr(''); setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr('Title is required.'); return; }
    setSaving(true); setErr('');
    try {
      // Auto-generate slug from title so the admin never has to type it
      const slug = form.title.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') +
        '-' + Date.now().toString(36);

      const payload = {
        ...form,
        slug,
        technologies: toArr(form.technologies),
        features:     toArr(form.features),
        screenshots:  form.screenshots,
      };
      if (editing) await adm.updateProject(editing._id, payload);
      else         await adm.createProject(payload);
      load(); setModal(false);
    } catch (e) { setErr(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await adm.deleteProject(id); load();
  };

  // Resolve thumbnail for list view
  const thumb = (src) => {
    return getUploadUrl(src);
  };

  return (
    <div>
      <PageHeader title="Projects" subtitle="Manage your portfolio projects" onAdd={openAdd} addLabel="Add Project" />

      {loading ? (
        <div className="space-y-3">
          {Array.from({length:3}).map((_,i) => <div key={i} className="h-20 bg-white rounded-2xl border animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet"
          subtitle="Add your first project to display it on your portfolio."
          onAdd={openAdd} addLabel="Add Project" />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex gap-4 items-start">

              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                {item.screenshots?.[0] ? (
                  <img src={thumb(item.screenshots[0])} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Image size={20} className="text-slate-300" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                  {item.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">Featured</span>
                  )}
                  {!item.isPublished && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">Draft</span>
                  )}
                </div>
                {item.solution && (
                  <p className="text-xs text-slate-500 line-clamp-1 mb-1">{item.solution}</p>
                )}
                {item.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.technologies.slice(0,5).map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.githubLink && (
                  <a href={safeUrl(item.githubLink)} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="View source code">
                    <GithubIcon size={15} />
                  </a>
                )}
                {item.demoLink && (
                  <a href={safeUrl(item.demoLink)} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-cyan-50"
                    title="Open live demo">
                    <Globe size={15} />
                  </a>
                )}
                <button onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal open={modal} onClose={() => setModal(false)}
        title={editing ? 'Edit Project' : 'Add Project'} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} noValidate className="space-y-5">
          {err && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{err}</div>}

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title" required>
              <Input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Smart Irrigation System" />
            </Field>
            <Field label="Category">
              <Input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Web App, IoT, Mobile" />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description / Solution">
            <Textarea name="solution" rows={4} value={form.solution} onChange={handleChange}
              placeholder="Describe what this project does, the problem it solves, and its key impact…" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Problem Background">
              <Textarea name="problemBackground" rows={3} value={form.problemBackground} onChange={handleChange}
                placeholder="What problem does it solve?" />
            </Field>
            <Field label="Objectives">
              <Textarea name="objectives" rows={3} value={form.objectives} onChange={handleChange}
                placeholder="What were the goals?" />
            </Field>
          </div>

          <Field label="Technologies (comma-separated)">
            <Input name="technologies" value={form.technologies} onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Arduino" />
          </Field>

          <Field label="Key Features (comma-separated)">
            <Input name="features" value={form.features} onChange={handleChange}
              placeholder="Real-time monitoring, Auto irrigation, SMS alerts" />
          </Field>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="GitHub URL">
              <Input name="githubLink" type="url" value={form.githubLink} onChange={handleChange}
                placeholder="https://github.com/…" />
            </Field>
            <Field label="Demo / Live URL">
              <Input name="demoLink" type="url" value={form.demoLink} onChange={handleChange}
                placeholder="https://your-demo.vercel.app" />
            </Field>
          </div>

          {/* Screenshots — device upload */}
          <Field label="Screenshots">
            <ScreenshotEditor
              screenshots={form.screenshots}
              onChange={urls => setForm(p => ({ ...p, screenshots: urls }))}
            />
          </Field>

          {/* Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <Checkbox label="Featured"  name="isFeatured"  checked={form.isFeatured}  onChange={handleChange} />
              <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</label>
              <Input name="order" type="number" value={form.order} onChange={handleChange}
                className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => setModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold disabled:opacity-60 transition-colors">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
