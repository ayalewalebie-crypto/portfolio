import React, { useEffect, useState, useCallback } from 'react';
import { adm } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import Modal      from '../../components/admin/Modal';
import EmptyState from '../../components/admin/EmptyState';
import { Field, Input, Textarea, Select, Checkbox } from '../../components/admin/FormField';
import { Briefcase, Pencil, Trash2, Calendar } from 'lucide-react';

const EMPTY = { title:'', company:'', location:'', type:'Internship', startDate:'', endDate:'', current:false, description:'', technologies:'', isPublished:true, order:0 };
const toDate = (d) => d ? new Date(d).toISOString().slice(0,10) : '';
const toArr  = (v) => Array.isArray(v) ? v : (v||'').split(',').map(s=>s.trim()).filter(Boolean);
const toStr  = (v) => Array.isArray(v) ? v.join(', ') : v||'';

const TYPE_COLOR = { Internship:'bg-sky-50 text-sky-700', 'Work Experience':'bg-emerald-50 text-emerald-700', Training:'bg-cyan-50 text-cyan-700' };

const Experience = () => {
  const [items,  setItems]  = useState([]);
  const [loading,setLoading]= useState(true);
  const [modal,  setModal]  = useState(false);
  const [editing,setEditing]= useState(null);
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const load = useCallback(()=>{ setLoading(true); adm.getExperience().then(({data})=>setItems(data)).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{ load(); },[load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({...item, startDate:toDate(item.startDate), endDate:toDate(item.endDate), technologies:toStr(item.technologies)}); setErr(''); setModal(true); };
  const handle   = (e) => { const {name,value,type,checked}=e.target; setForm(p=>({...p,[name]:type==='checkbox'?checked:value})); };
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      const payload = {...form, technologies:toArr(form.technologies)};
      if (editing) await adm.updateExperience(editing._id, payload);
      else         await adm.createExperience(payload);
      load(); setModal(false);
    } catch(e){ setErr(e.response?.data?.message||'Save failed'); } finally{ setSaving(false); }
  };
  const del = async (id) => { if (!window.confirm('Delete?')) return; await adm.deleteExperience(id); load(); };

  return (
    <div>
      <PageHeader title="Experience" subtitle="Internships, work experience, and training" onAdd={openAdd} addLabel="Add Experience" />
      {loading ? <div className="space-y-3">{Array.from({length:2}).map((_,i)=><div key={i} className="h-20 bg-white rounded-2xl border animate-pulse"/>)}</div>
      : items.length===0 ? <EmptyState icon={Briefcase} title="No experience added" subtitle="Add internships, work experience or training." onAdd={openAdd} addLabel="Add Experience"/>
      : (
        <div className="space-y-3">
          {items.map(item=>(
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0"><Briefcase size={18} className="text-sky-600"/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[item.type]||'bg-slate-100 text-slate-500'}`}>{item.type||'Experience'}</span>
                  {item.current && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Current</span>}
                </div>
                <p className="text-sm text-cyan-600 font-semibold">{item.company}{item.location && <span className="text-slate-400 font-normal"> · {item.location}</span>}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Calendar size={11}/>{new Date(item.startDate).toLocaleDateString('en-US',{month:'short',year:'numeric'})} – {item.current?'Present':item.endDate?new Date(item.endDate).toLocaleDateString('en-US',{month:'short',year:'numeric'}):''}</p>
                {item.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>}
                {item.technologies?.length>0 && <div className="flex flex-wrap gap-1 mt-2">{item.technologies.map(t=><span key={t} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">{t}</span>)}</div>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={()=>openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"><Pencil size={15}/></button>
                <button onClick={()=>del(item._id)}  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={15}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Edit Experience':'Add Experience'}>
        <form onSubmit={handleSave} className="space-y-4">
          {err && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{err}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title / Role" required><Input name="title" value={form.title} onChange={handle} required placeholder="Software Intern"/></Field>
            <Field label="Company / Organisation" required><Input name="company" value={form.company} onChange={handle} required/></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Type">
              <Select name="type" value={form.type} onChange={handle}>
                <option>Internship</option>
                <option>Work Experience</option>
                <option>Training</option>
              </Select>
            </Field>
            <Field label="Location"><Input name="location" value={form.location} onChange={handle}/></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date" required><Input name="startDate" type="date" value={form.startDate} onChange={handle} required/></Field>
            <Field label="End Date"><Input name="endDate" type="date" value={form.endDate} onChange={handle} disabled={form.current}/></Field>
          </div>
          <Checkbox label="Currently working here" name="current" checked={form.current} onChange={handle}/>
          <Field label="Description"><Textarea name="description" rows={3} value={form.description} onChange={handle}/></Field>
          <Field label="Technologies (comma-separated)"><Input name="technologies" value={form.technologies} onChange={handle} placeholder="React, Node.js"/></Field>
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
export default Experience;
