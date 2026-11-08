import React, { useState, useEffect, useRef } from 'react';
import { adm, getUploadUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Field, Input, Textarea } from '../../components/admin/FormField';
import {
  User, BookOpen, Link as LinkIcon, Lock,
  CheckCircle2, AlertCircle, Save, Loader2, Camera,
} from 'lucide-react';

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
      <Icon size={16} className="text-cyan-500"/>
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Toast = ({ msg }) => {
  if (!msg.text) return null;
  const ok = msg.type === 'success';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${
      ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
    }`}>
      {ok ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
      {msg.text}
    </div>
  );
};

const Settings = () => {
  const { refreshToken } = useAuth();

  const [profile, setProfile] = useState({
    name:'', title:'', introduction:'', about:'',
    email:'', phone:'', location:'',
    github:'', linkedin:'', twitter:'', telegram:'', instagram:'', facebook:'',
    profilePhoto:'', yearsExp: 0,
  });

  const [pwForm, setPwForm] = useState({
    currentPassword:'', newPassword:'', confirmPassword:'',
  });

  const [loading,       setLoading]        = useState(true);
  const [saving,        setSaving]         = useState(false);
  const [savingPw,      setSavingPw]       = useState(false);
  const [uploadingPhoto,setUploadingPhoto] = useState(false);
  const [toast,         setToast]          = useState({ text:'', type:'' });
  const photoInputRef = useRef(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text:'', type:'' }), 4500);
  };

  useEffect(() => {
    adm.getProfile()
      .then(({ data }) => { if (data?._id) setProfile(p => ({ ...p, ...data })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProfile = (e) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const handlePw = (e) => {
    const { name, value } = e.target;
    setPwForm(p => ({ ...p, [name]: value }));
  };

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('photo', file);
    setUploadingPhoto(true);
    try {
      const { data } = await adm.uploadProfilePhoto(fd);
      setProfile(p => ({ ...p, profilePhoto: data.profilePhoto }));
      showToast('Profile photo updated!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Photo upload failed.', 'error');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // ── Save public profile ───────────────────────────────────────────────────
  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adm.updateProfile(profile);
      showToast('Public profile saved!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save profile.', 'error');
    } finally { setSaving(false); }
  };

  // ── Change password ───────────────────────────────────────────────────────
  const savePw = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return showToast('New passwords do not match.', 'error');
    if (pwForm.newPassword.length < 6)
      return showToast('Password must be at least 6 characters.', 'error');
    setSavingPw(true);
    try {
      const { data } = await adm.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      if (data.token) refreshToken(data.token);
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
      showToast('Password changed successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password.', 'error');
    } finally { setSavingPw(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={28} className="animate-spin text-cyan-400"/>
    </div>
  );

  const photoSrc = profile.profilePhoto ? getUploadUrl(profile.profilePhoto) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your public portfolio and account security.</p>
      </div>

      {/* ── Profile Photo ─────────────────────────────────────────────────── */}
      <Section title="Profile Photo" icon={User}>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cyan-50 border-2 border-cyan-100 shadow-sm">
              {photoSrc
                ? <img src={photoSrc} alt="Profile" className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-cyan-400">
                    {profile.name?.[0] || 'A'}
                  </div>
              }
            </div>
            <label htmlFor="photo-upload"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform"
              style={{ background:'linear-gradient(135deg,#0891b2,#06b6d4)' }}
              title="Change photo">
              {uploadingPhoto
                ? <Loader2 size={13} className="text-white animate-spin"/>
                : <Camera size={13} className="text-white"/>}
            </label>
            <input id="photo-upload" ref={photoInputRef} type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto}/>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Upload from your device</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the camera icon · JPG, PNG or WebP · Max 10 MB
            </p>
            {uploadingPhoto && (
              <p className="text-xs text-cyan-500 font-semibold mt-2 flex items-center gap-1">
                <Loader2 size={11} className="animate-spin"/> Uploading…
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* ── Public Profile ────────────────────────────────────────────────── */}
      <form onSubmit={saveProfile} className="space-y-6">
        <Section title="Public Profile" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Display Name" required>
              <Input name="name" value={profile.name} onChange={handleProfile} required placeholder="e.g. Alebie Ayalew"/>
            </Field>
            <Field label="Professional Title" required>
              <Input name="title" value={profile.title} onChange={handleProfile} required placeholder="Full-Stack Developer"/>
            </Field>
            <Field label="Contact Email" required>
              <Input name="email" type="email" value={profile.email} onChange={handleProfile} required/>
            </Field>
            <Field label="Phone">
              <Input name="phone" value={profile.phone} onChange={handleProfile}/>
            </Field>
            <Field label="Location">
              <Input name="location" value={profile.location} onChange={handleProfile} placeholder="Bahir Dar, Ethiopia"/>
            </Field>
            <Field label="Years of Experience">
              <Input name="yearsExp" type="number" min="0" max="50" value={profile.yearsExp} onChange={handleProfile} placeholder="e.g. 2"/>
            </Field>
          </div>
        </Section>

        <Section title="Bio & Introduction" icon={BookOpen}>
          <div className="space-y-4">
            <Field label="Short Introduction (Hero)">
              <Textarea name="introduction" rows={2} value={profile.introduction} onChange={handleProfile}
                placeholder="One or two sentences about yourself…"/>
            </Field>
            <Field label="About Me (Full Bio)">
              <Textarea name="about" rows={5} value={profile.about} onChange={handleProfile}
                placeholder="Your background, interests, and story…"/>
            </Field>
          </div>
        </Section>

        <Section title="Social Links" icon={LinkIcon}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="GitHub URL">
              <Input name="github" type="url" value={profile.github} onChange={handleProfile}
                placeholder="https://github.com/username"/>
            </Field>
            <Field label="LinkedIn URL">
              <Input name="linkedin" type="url" value={profile.linkedin} onChange={handleProfile}
                placeholder="https://linkedin.com/in/username"/>
            </Field>
            <Field label="Twitter / X URL">
              <Input name="twitter" type="url" value={profile.twitter} onChange={handleProfile}
                placeholder="https://twitter.com/username"/>
            </Field>
            <Field label="Telegram Username">
              <Input name="telegram" value={profile.telegram} onChange={handleProfile}
                placeholder="username (without @)"/>
            </Field>
            <Field label="Instagram URL / Username">
              <Input name="instagram" value={profile.instagram} onChange={handleProfile}
                placeholder="https://instagram.com/username or @username"/>
            </Field>
            <Field label="Facebook URL">
              <Input name="facebook" value={profile.facebook||''} onChange={handleProfile}
                placeholder="https://facebook.com/username"/>
            </Field>
          </div>
        </Section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold shadow-sm disabled:opacity-60 transition-colors">
            {saving ? <><Loader2 size={15} className="animate-spin"/>Saving…</> : <><Save size={15}/>Save Profile</>}
          </button>
        </div>
      </form>

      {/* ── Change Password ───────────────────────────────────────────────── */}
      <form onSubmit={savePw}>
        <Section title="Change Password" icon={Lock}>
          <div className="space-y-4">
            <Field label="Current Password">
              <Input name="currentPassword" type="password" value={pwForm.currentPassword}
                onChange={handlePw} required placeholder="Enter your current password"/>
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="New Password">
                <Input name="newPassword" type="password" value={pwForm.newPassword}
                  onChange={handlePw} placeholder="Min. 6 characters" required/>
              </Field>
              <Field label="Confirm New Password">
                <Input name="confirmPassword" type="password" value={pwForm.confirmPassword}
                  onChange={handlePw} required/>
              </Field>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={savingPw}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold disabled:opacity-60 transition-colors">
                {savingPw
                  ? <><Loader2 size={15} className="animate-spin"/>Updating…</>
                  : <><Lock size={14}/>Update Password</>}
              </button>
            </div>
          </div>
        </Section>
      </form>

      <Toast msg={toast}/>
    </div>
  );
};

export default Settings;
