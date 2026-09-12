import { Link } from 'react-router-dom';
import { assets } from '../../lib/assets';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardShell({ data, active, setActive, children }) {
  const { signOut } = useAuth();
  return <div className="min-h-screen bg-slate-50 md:flex">
    <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 p-5 text-white md:fixed md:inset-y-0 md:flex">
      <Link to="/" className="mb-10 flex items-center gap-2 text-xl font-bold"><img className="h-10 w-10 object-contain" src={assets.logo} alt="CheafIn"/>CheafIn</Link>
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{data.role} workspace</p>
      <nav className="space-y-1">{data.navigation.map(item => <button onClick={() => setActive(item.key)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${active === item.key ? 'bg-brand-500 text-white shadow-lg shadow-orange-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`} key={item.key}><span>{item.icon}</span>{item.label}</button>)}</nav>
      <button onClick={signOut} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/10 hover:text-white">↪ Sign out</button>
    </aside>
    <main className="min-w-0 flex-1 pb-20 md:ml-64 md:pb-8"><header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8"><div><p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{data.role} portal</p><h1 className="font-bold text-slate-900">{data.greeting}</h1></div><div className="flex items-center gap-4"><button aria-label="Notifications" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">🔔<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-500"/></button><button onClick={() => setActive('profile')} className="flex items-center gap-2"><img className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-100" src={assets[data.avatar]} alt=""/><span className="hidden text-sm font-semibold sm:block">{data.name}</span></button></div></header><div className="p-5 md:p-8">{children}</div></main>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white px-2 py-2 md:hidden">{data.navigation.slice(0, 5).map(item => <button onClick={() => setActive(item.key)} className={`grid min-w-13 place-items-center gap-1 rounded-lg px-2 py-1 text-[10px] ${active === item.key ? 'font-bold text-brand-500' : 'text-slate-500'}`} key={item.key}><span className="text-lg">{item.icon}</span>{item.mobile || item.label}</button>)}</nav>
  </div>;
}
