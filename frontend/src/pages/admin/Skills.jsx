import React, { useEffect, useState, useCallback } from 'react';
import { adm } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import Modal      from '../../components/admin/Modal';
import EmptyState from '../../components/admin/EmptyState';
import { Field, Input, Select, Textarea, Checkbox } from '../../components/admin/FormField';
import { Code2, Pencil, Trash2 } from 'lucide-react';

const CATEGORIES = ['Frontend','Backend','Database','DevOps','Mobile','IoT','Networking','Languages','Tools','Other'];

const EMPTY = { name: '', category: 'Frontend', description: '', isPublished: true, order: 0 };

const Skills = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adm.getSkills().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true); };
  const openEdit = (sk) => { setEditing(sk); setForm({ ...EMPTY, ...sk }); setErr(''); setModal(true); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      if (editing) await adm.updateSkill(editing._id, form);
      else         await adm.createSkill(form);
      load(); setModal(false);
    } catch (ex) { setErr(ex.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    await adm.deleteSkill(id); load();
  };

  const groups = items.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s); return acc;
  }, {});

  const CAT_COLOR = {
    Frontend:'bg-cyan-50 text-cyan-700', Backend:'bg-blue-50 text-blue-700',
    Database:'bg-emerald-50 text-emerald-700', DevOps:'bg-amber-50 text-amber-700',
    Mobile:'bg-sky-50 text-sky-700', IoT:'bg-rose-50 text-rose-700',
    Networking:'bg-teal-50 text-teal-700', Languages:'bg-orange-50 text-orange-700',
    Tools:'bg-slate-100 text-slate-600', Other:'bg-slate-100 text-slate-500',
  };

  return (
    <div>
      <PageHeader title="Skills" subtitle="Add skills — icons are set automatically on the public page" onAdd={openAdd} addLabel="Add Skill" />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl border animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Code2} title="No skills yet" subtitle="Add skills to showcase your technical expertise." onAdd={openAdd} addLabel="Add Skill" />
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([cat, catSkills]) => (
            <div key={cat}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="flex-1 h-px bg-slate-100" />{cat}<span className="flex-1 h-px bg-slate-100" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {catSkills.map(sk => (
                  <div key={sk._id} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-xs">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${CAT_COLOR[cat] || 'bg-slate-100 text-slate-500'}`}>
                      {sk.name}
                    </span>
                    {sk.description && (
                      <p className="text-xs text-slate-400 flex-1 truncate">{sk.description}</p>
                    )}
                    <div className="flex gap-1 flex-shrink-0 ml-auto">
                      <button onClick={() => openEdit(sk)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(sk._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `Edit — ${editing.name}` : 'Add Skill'} maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          {err && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{err}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Skill Name" required>
              <Input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. React" />
            </Field>
            <Field label="Category" required>
              <Select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </Field>
          </div>

          <Field label="Description (what you know / have built with this skill)">
            <Textarea name="description" rows={4} value={form.description} onChange={handleChange}
              placeholder="Describe your experience — projects built, years used, certifications, etc." />
          </Field>

          <div className="flex items-center justify-between">
            <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={handleChange} />
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange}
                className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold disabled:opacity-60">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Skills;
