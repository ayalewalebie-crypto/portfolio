import React from 'react';
import { PlusCircle } from 'lucide-react';

/**
 * Standard admin page header: title + subtitle + optional Add button
 */
const PageHeader = ({ title, subtitle, onAdd, addLabel = 'Add New' }) => (
  <div className="flex items-start sm:items-center justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {onAdd && (
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all flex-shrink-0"
      >
        <PlusCircle size={16} />
        {addLabel}
      </button>
    )}
  </div>
);

export default PageHeader;
