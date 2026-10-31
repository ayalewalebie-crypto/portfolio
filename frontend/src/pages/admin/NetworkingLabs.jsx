import React, { useEffect, useState, useCallback } from 'react';
import { adm } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import Modal      from '../../components/admin/Modal';
import EmptyState from '../../components/admin/EmptyState';
import { Field, Input, Textarea, Checkbox } from '../../components/admin/FormField';
import { Network, Pencil, Trash2, Star } from 'lucide-react';

const EMPTY = { title:'', slug:'', objectives:'', technologies:'', topologyImage:'', explanations:'', results:'', troubleshooting:'', lessonsLearned:'', isFeatured:false, isPublished:true, order:0 };
const toArr = (v) => Array.isArray(v) ? v : (v||'').split('\n').map(s=>s.trim()).filter(Boolean);
const toStr = (v) => Array.isArray(v) ? v.join('\n') : v||'';
const toArrComma = (v) => Array.isArray(v)?v:(v||'').split(',').map(s=>s.trim()).filter(Boolean);
const toStrComma = (v) => Array.isArray(v)?v.join(', '):v||'';

const NetworkingLabs = () => {
  const [items,  setItems]  = useState([]);
  const [loading,setLoading]= useState(true);
  const [modal,  setModal]  = useState(false);
  const [editing,setEditing]= useState(null);
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const load = useCallback(()=>{ setLoading(true); adm.getLabs().then(({data})=>setItems(data)).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{ load(); },[load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({...item, objectives:toStr(item.objectives), technologies:toStrComma(item.technologies)}); setErr(''); setModal(true); };
  const handle   = (e) => { const {name,value,type,checked}=e.target; setForm(p=>({...p,[name]:type==='checkbox'?checked:value})); };
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      const payload = {...form, objectives:toArr(form.objectives), technologies:toArrComma(form.technologies)};
      if (editing) await adm.updateLab(editing._id, payload);
      else         await adm.createLab(payload);
      load(); setModal(false);
    } catch(e){ setErr(e.response?.data?.message||'Save failed'); } finally{ setSaving(false); }
  };
  const del = async (id) => { if (!window.confirm('Delete this lab?')) return; await adm.deleteLab(id); load(); };

  return (
    <div>
      <PageHeader title="Networking Labs" subtitle="Cisco Packet Tracer labs, topologies, and configurations" onAdd={openAdd} addLabel="Add Lab" />
      {loading ? <div className="space-y-3">{Array.from({length:2}).map((_,i)=><div key={i} className="h-24 bg-white rounded-2xl border animate-pulse"/>)}</div>
      : items.length===0 ? <EmptyState icon={Network} title="No labs yet" subtitle="Add networking labs, topologies, and Packet Tracer configurations." onAdd={openAdd} addLabel="Add Lab"/>
      : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item=>(
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0"><Network size={18} className="text-teal-600"/></div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{item.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {item.isFeatured && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"><Star size={8} fill="currentColor"/>Featured</span>}
                  <button onClick={()=>openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"><Pencil size={14}/></button>
                  <button onClick={()=>del(item._id)}  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"><Trash2 size={14}/></button>
                </div>
              </div>
              {item.technologies?.length>0 && <div className="flex flex-wrap gap-1">{item.technologies.map(t=><span key={t} className="text-[11px] px-2 py-0.5 bg-teal-50 text-teal-700 rounded font-mono">{t}</span>)}</div>}
              {item.objectives?.length>0 && <p className="text-xs text-slate-500 mt-2 line-clamp-2">• {item.objectives[0]}</p>}
            </div>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Edit Lab':'Add Networking Lab'} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          {err && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{err}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Lab Title" required><Input name="title" value={form.title} onChange={handle} required placeholder="Campus Network Design"/></Field>
            <Field label="Slug" required><Input name="slug" value={form.slug} onChange={handle} required placeholder="campus-network-design"/></Field>
          </div>
          <Field label="Technologies (comma-separated)"><Input name="technologies" value={form.technologies} onChange={handle} placeholder="Cisco, OSPF, VLANs, STP"/></Field>
          <Field label="Objectives (one per line)"><Textarea name="objectives" rows={3} value={form.objectives} onChange={handle} placeholder="Design a scalable campus network&#10;Configure VLANs and inter-VLAN routing"/></Field>
          <Field label="Topology Image URL"><Input name="topologyImage" type="url" value={form.topologyImage} onChange={handle} placeholder="https://..."/></Field>
          <Field label="Explanations / Overview"><Textarea name="explanations" rows={3} value={form.explanations} onChange={handle}/></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Results"><Textarea name="results" rows={2} value={form.results} onChange={handle}/></Field>
            <Field label="Troubleshooting Notes"><Textarea name="troubleshooting" rows={2} value={form.troubleshooting} onChange={handle}/></Field>
          </div>
          <Field label="Lessons Learned"><Textarea name="lessonsLearned" rows={2} value={form.lessonsLearned} onChange={handle}/></Field>
          <div className="flex flex-wrap gap-4">
            <Checkbox label="Featured" name="isFeatured" checked={form.isFeatured} onChange={handle}/>
            <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={handle}/>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={()=>setModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold disabled:opacity-60">{saving?'Saving…':editing?'Save Changes':'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default NetworkingLabs;
