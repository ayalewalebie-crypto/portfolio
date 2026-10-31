import React, { useEffect, useState, useCallback } from 'react';
import { adm } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import Modal      from '../../components/admin/Modal';
import EmptyState from '../../components/admin/EmptyState';
import { Field, Input, Textarea, Checkbox } from '../../components/admin/FormField';
import { GraduationCap, Pencil, Trash2, Calendar } from 'lucide-react';

const EMPTY = { degree:'', institution:'', location:'', startDate:'', endDate:'', current:false, description:'', isPublished:true, order:0 };
const toDate = (d) => d ? new Date(d).toISOString().slice(0,10) : '';

const Education = () => {
  const [items,  setItems]  = useState([]);
  const [loading,setLoading]= useState(true);
  const [modal,  setModal]  = useState(false);
  const [editing,setEditing]= useState(null);
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const load = useCallback(()=>{ setLoading(true); adm.getEducation().then(({data})=>setItems(data)).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{ load(); },[load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({...item, startDate:toDate(item.startDate), endDate:toDate(item.endDate)}); setErr(''); setModal(true); };
  const handle   = (e) => { const {name,value,type,checked}=e.target; setForm(p=>({...p,[name]:type==='checkbox'?checked:value})); };
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      if (editing) await adm.updateEducation(editing._id, form);
      else         await adm.createEducation(form);
      load(); setModal(false);
    } catch(e){ setErr(e.response?.data?.message||'Save failed'); } finally{ setSaving(false); }
  };
  const del = async (id) => { if (!window.confirm('Delete?')) return; await adm.deleteEducation(id); load(); };

  return (
    <div>
      <PageHeader title="Education" subtitle="Academic background and qualifications" onAdd={openAdd} addLabel="Add Education" />
      {loading ? <div className="space-y-3">{Array.from({length:2}).map((_,i)=><div key={i} className="h-20 bg-white rounded-2xl border animate-pulse"/>)}</div>
      : items.length===0 ? <EmptyState icon={GraduationCap} title="No education added" onAdd={openAdd} addLabel="Add Education"/>
      : (
        <div className="space-y-3">
          {items.map(item=>(
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><GraduationCap size={18} className="text-emerald-600"/></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900">{item.degree}</h3>
                <p className="text-sm text-cyan-600 font-semibold">{item.institution}{item.location && <span className="text-slate-400 font-normal"> · {item.location}</span>}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Calendar size={11}/>{new Date(item.startDate).getFullYear()} – {item.current?'Present':item.endDate?new Date(item.endDate).getFullYear():''}</p>
                {item.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={()=>openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"><Pencil size={15}/></button>
                <button onClick={()=>del(item._id)}  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={15}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Edit Education':'Add Education'}>
        <form onSubmit={handleSave} className="space-y-4">
          {err && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{err}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Degree / Qualification" required><Input name="degree" value={form.degree} onChange={handle} required placeholder="B.Sc. Information Systems"/></Field>
            <Field label="Institution" required><Input name="institution" value={form.institution} onChange={handle} required placeholder="Bahir Dar University"/></Field>
          </div>
          <Field label="Location"><Input name="location" value={form.location} onChange={handle} placeholder="Bahir Dar, Ethiopia"/></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date" required><Input name="startDate" type="date" value={form.startDate} onChange={handle} required/></Field>
            <Field label="End Date"><Input name="endDate" type="date" value={form.endDate} onChange={handle} disabled={form.current}/></Field>
          </div>
          <Checkbox label="Currently studying here" name="current" checked={form.current} onChange={handle}/>
          <Field label="Description"><Textarea name="description" rows={3} value={form.description} onChange={handle} placeholder="Relevant courses, achievements..."/></Field>
          <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={handle}/>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={()=>setModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold disabled:opacity-60">{saving?'Saving…':editing?'Save Changes':'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Education;
