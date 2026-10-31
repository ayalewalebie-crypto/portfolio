import React, { useEffect, useState, useCallback } from 'react';
import { adm } from '../../services/api';
import PageHeader from '../../components/admin/PageHeader';
import Modal      from '../../components/admin/Modal';
import EmptyState from '../../components/admin/EmptyState';
import { Field, Input, Checkbox } from '../../components/admin/FormField';
import { Award, Pencil, Trash2, ExternalLink, Calendar } from 'lucide-react';

const EMPTY = { name:'', issuer:'', issueDate:'', credentialId:'', credentialUrl:'', isPublished:true, order:0 };
const toDate = (d) => d ? new Date(d).toISOString().slice(0,10) : '';

const Certifications = () => {
  const [items,  setItems]  = useState([]);
  const [loading,setLoading]= useState(true);
  const [modal,  setModal]  = useState(false);
  const [editing,setEditing]= useState(null);
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const load = useCallback(()=>{ setLoading(true); adm.getCertifications().then(({data})=>setItems(data)).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{ load(); },[load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({...item, issueDate:toDate(item.issueDate)}); setErr(''); setModal(true); };
  const handle   = (e) => { const {name,value,type,checked}=e.target; setForm(p=>({...p,[name]:type==='checkbox'?checked:value})); };
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      if (editing) await adm.updateCertification(editing._id, form);
      else         await adm.createCertification(form);
      load(); setModal(false);
    } catch(e){ setErr(e.response?.data?.message||'Save failed'); } finally{ setSaving(false); }
  };
  const del = async (id) => { if (!window.confirm('Delete?')) return; await adm.deleteCertification(id); load(); };

  return (
    <div>
      <PageHeader title="Certifications" subtitle="Professional certifications and credentials" onAdd={openAdd} addLabel="Add Certificate" />
      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-28 bg-white rounded-2xl border animate-pulse"/>)}</div>
      : items.length===0 ? <EmptyState icon={Award} title="No certifications yet" subtitle="Add your professional certificates and credentials." onAdd={openAdd} addLabel="Add Certificate"/>
      : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item=>(
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0"><Award size={18} className="text-amber-500"/></div>
                <div className="flex gap-1">
                  {item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"><ExternalLink size={13}/></a>}
                  <button onClick={()=>openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"><Pencil size={13}/></button>
                  <button onClick={()=>del(item._id)}  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"><Trash2 size={13}/></button>
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm leading-snug">{item.name}</p>
                <p className="text-cyan-600 text-xs font-semibold mt-0.5">{item.issuer}</p>
                {item.issueDate && <p className="text-slate-400 text-xs mt-1 flex items-center gap-1"><Calendar size={10}/>{new Date(item.issueDate).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</p>}
                {item.credentialId && <p className="text-[10px] text-slate-300 font-mono mt-1 truncate">ID: {item.credentialId}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Edit Certificate':'Add Certificate'} maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          {err && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{err}</div>}
          <Field label="Certificate Name" required><Input name="name" value={form.name} onChange={handle} required placeholder="e.g. CCNA Routing & Switching"/></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Issuing Organisation" required><Input name="issuer" value={form.issuer} onChange={handle} required placeholder="Cisco, Google, etc."/></Field>
            <Field label="Issue Date" required><Input name="issueDate" type="date" value={form.issueDate} onChange={handle} required/></Field>
          </div>
          <Field label="Credential ID"><Input name="credentialId" value={form.credentialId} onChange={handle}/></Field>
          <Field label="Credential URL"><Input name="credentialUrl" type="url" value={form.credentialUrl} onChange={handle} placeholder="https://..."/></Field>
          <div className="flex items-center justify-between">
            <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={handle}/>
            <div className="flex items-center gap-2"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Order</label><input type="number" name="order" value={form.order} onChange={handle} className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center"/></div>
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
export default Certifications;
