export function RolePicker({ role, setRole: setRoleState }) {
  const setRole = (value) => {
    localStorage.setItem('selectedRole', value);
    setRoleState(value);
  };
  const classes = (value) => `flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${role === value ? 'border-brand-500 bg-orange-50 text-brand-600 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50/50'}`;
  return <div className="mb-7 mt-3 grid grid-cols-2 gap-3"><button type="button" className={classes('chef')} onClick={() => setRole('chef')}><span className="mr-1.5">👨‍🍳</span>Chef</button><button type="button" className={classes('restaurant')} onClick={() => setRole('restaurant')}><span className="mr-1.5">🏪</span>Restaurant</button></div>;
}
