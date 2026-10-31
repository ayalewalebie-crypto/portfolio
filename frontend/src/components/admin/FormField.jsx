import React from 'react';

/** Labelled input / textarea / select wrapper */
export const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
      {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
  </div>
);

export const inputCls = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all';

export const Input = (props) => <input className={inputCls} {...props} />;

export const Textarea = ({ rows = 3, ...props }) => (
  <textarea className={`${inputCls} resize-y`} rows={rows} {...props} />
);

export const Select = ({ children, ...props }) => (
  <select className={inputCls} {...props}>{children}</select>
);

export const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center gap-2.5 cursor-pointer select-none">
    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" {...props} />
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);
