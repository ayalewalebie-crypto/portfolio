import React, { useEffect, useState, useCallback, useRef } from 'react';
import { adm, UPLOADS_PROXY } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import Modal      from '../../components/admin/Modal';
import EmptyState from '../../components/admin/EmptyState';
import { Field, Input, Textarea, Checkbox } from '../../components/admin/FormField';
import { Trophy, Pencil, Trash2, Calendar, Upload, Loader2, X, Image } from 'lucide-react';

const EMPTY = { title:'', issuer:'', date:'', description:'', image:'', isPublished:true, order:0 };
const toDate = (d) => d ? new Date(d).toISOString().slice(0,10) : '';

// Resolve stored image path through the Vite proxy
const resolveImg = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/uploads/')) return `${UPLOADS_PROXY}${src.slice('/uploads'.length)}`;
  return src;
};

// ── Image upload widget ───────────────────────────────────────────────────────
const ImageUploader = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setErr(''); setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await adm.uploadAchievementImage(fd);
      onChange(data.url);
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const clear = () => { onChange(''); if (fileRef.current) fileRef.current.value = ''; };

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={resolveImg(value)}
            alt="Certificate / Award"
            className="w-full max-h-48 object-contain rounded-xl border border-slate-200 bg-slate-50"
          />
          <button
            type="button"
            onClick={clear}
            className="absolute top-1.5 right-1.5 p-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            title="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-xl transition-colors cursor-pointer"
          onClick={() => !uploading && fileRef.current?.click()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center justify-center gap-2 py-5 px-4 text-center">
            {uploading ? (
              <>
                <Loader2 size={22} className="text-purple-500 animate-spin" />
                <p className="text-sm text-slate-500">Uploading…</p>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Upload size={16} className="text-purple-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, WebP · Max 10 MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {err && <p className="text-xs text-rose-500">{err}</p>}
      <p className="text-[11px] text-slate-400">
        Upload the certificate, award, or badge image. Shows on the public page.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Achievements = () => {
  const [items,  setItems]  = useState([]);
  const [loading,setLoading]= useState(true);
  const [modal,  setModal]  = useState(false);
  const [editing,setEditing]= useState(null);
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adm.getAchievements().then(({data}) => setItems(data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item, date: toDate(item.date), image: item.image || '' });
    setErr(''); setModal(true);
  };

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr('Title is required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) await adm.updateAchievement(editing._id, form);
      else         await adm.createAchievement(form);
      load(); setModal(false);
    } catch (e) { setErr(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    await adm.deleteAchievement(id); load();
  };

  return (
    <div>
      <PageHeader
        title="Achievements"
        subtitle="Awards, honours, certifications and recognitions"
        onAdd={openAdd}
        addLabel="Add Achievement"
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({length:2}).map((_,i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          subtitle="Add your awards, honours, and certifications."
          onAdd={openAdd}
          addLabel="Add Achievement"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Certificate thumbnail or trophy icon */}
                  {item.image ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
                      <img
                        src={resolveImg(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <Trophy size={18} className="text-amber-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{item.title}</p>
                    {item.issuer && (
                      <p className="text-purple-600 text-xs font-semibold truncate">{item.issuer}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => del(item._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {item.date && (
                <p className="text-slate-400 text-xs mb-1.5 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              )}
              {item.description && (
                <p className="text-slate-500 text-xs line-clamp-2">{item.description}</p>
              )}
              {item.image && (
                <p className="text-[11px] text-purple-500 mt-1.5 flex items-center gap-1">
                  <Image size={10} /> Certificate image attached
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Achievement' : 'Add Achievement'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} noValidate className="space-y-4">
          {err && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{err}</div>
          )}

          <Field label="Title" required>
            <Input
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="e.g. Best Final Year Project Award"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Issuer / Organisation">
              <Input
                name="issuer"
                value={form.issuer}
                onChange={handle}
                placeholder="Bahir Dar University"
              />
            </Field>
            <Field label="Date">
              <Input name="date" type="date" value={form.date} onChange={handle} />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handle}
              placeholder="Brief description of the achievement…"
            />
          </Field>

          {/* Certificate / Award image upload */}
          <Field label="Certificate / Award Image">
            <ImageUploader
              value={form.image}
              onChange={url => setForm(p => ({ ...p, image: url }))}
            />
          </Field>

          <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={handle} />

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Achievements;
