import React from 'react';
import { PlusCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon, title, subtitle, onAdd, addLabel }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
    )}
    <p className="text-base font-semibold text-slate-700">{title}</p>
    {subtitle && <p className="text-sm text-slate-400 mt-1 max-w-xs">{subtitle}</p>}
    {onAdd && (
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-all"
      >
        <PlusCircle size={15} />
        {addLabel || 'Add First'}
      </button>
    )}
  </div>
);

export default EmptyState;
