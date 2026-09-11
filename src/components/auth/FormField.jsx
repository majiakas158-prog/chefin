export const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100';
export function FormField({label,children}) { return <label className="mb-4 block text-sm font-medium text-slate-700"><span className="mb-2 block">{label}</span>{children}</label>; }
