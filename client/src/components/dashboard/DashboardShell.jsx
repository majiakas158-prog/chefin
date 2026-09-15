import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../lib/assets';
import { useAuth } from '../../contexts/AuthContext';

const paths = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  briefcase: 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m7 4H1m2-4h18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z',
  message: 'M21 11.5a8.4 8.4 0 0 1-9 8.3 9.7 9.7 0 0 1-4-.8L3 21l1.6-4.4A8 8 0 1 1 21 11.5Z',
  user: 'M20 21a8 8 0 0 0-16 0m12-14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4',
  plus: 'M12 5v14M5 12h14',
  logout: 'M10 17l5-5-5-5m5 5H3m9-8h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  filter: 'M4 6h16M7 12h10m-7 6h4',
  x: 'M6 6l12 12M18 6 6 18',
};

export function Icon({ name, className = '' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${className}`}><path d={paths[name] || paths.home}/></svg>;
}

export function DashboardShell({ data, active, setActive, setSearch, onPopup, children }) {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const select = (key) => { setActive(key); setOpen(false); };
  const nav = <nav className="space-y-1">{data.navigation.map(item => <button onClick={() => select(item.key)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${active === item.key ? 'bg-brand-500 text-white shadow-lg shadow-orange-950/25' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`} key={item.key}><Icon name={item.icon}/><span className="flex-1">{item.label}</span>{item.count && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">{item.count}</span>}</button>)}</nav>;
  return <div className="min-h-screen bg-[#f7f9fc] md:flex">
    {open && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-slate-950/45 md:hidden" onClick={() => setOpen(false)}/>}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col bg-[#10182f] p-5 text-white transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-10 flex items-center justify-between"><Link to="/" className="flex items-center gap-2 text-xl font-bold"><img className="h-10 w-10 object-contain" src={assets.logo} alt="ChefIn"/>ChefIn</Link><button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><Icon name="x"/></button></div>
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[.16em] text-slate-500">{data.role} workspace</p>{nav}
      <div className="mt-auto"><p className="mb-5 px-3 text-sm font-semibold leading-5 text-slate-400">Better Chefs<br/>Build Better Restaurants</p><button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"><Icon name="logout"/>Sign out</button></div>
    </aside>
    <main className="min-w-0 flex-1 pb-20 md:ml-[17rem] md:pb-8">
      <header className="sticky top-0 z-30 border-b border-[#e6eaf0] bg-white/95 px-4 py-3 backdrop-blur md:px-8 md:py-4"><div className="flex items-center gap-3"><button className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu"/></button><div className="min-w-0 flex-1"><p className="hidden text-sm text-slate-500 sm:block">Keep going! Your skills create great food and opportunities.</p><h1 className="truncate text-base font-bold text-[#17213a] md:text-lg">{data.greeting} <span aria-hidden="true">👋</span></h1></div><form onSubmit={(event) => { event.preventDefault(); setSearch?.(event.currentTarget.search.value); select('discover'); }} className="hidden max-w-md flex-1 items-center rounded-xl border border-slate-200 bg-[#f7f9fc] px-3 lg:flex"><Icon name="search" className="text-slate-400"/><input name="search" aria-label="Search jobs" className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none" placeholder="Search jobs, cuisine or location..."/><button type="submit" aria-label="Filter jobs" className="text-slate-400 hover:text-brand-500"><Icon name="filter"/></button></form><button aria-label="Open notifications" onClick={() => onPopup ? onPopup('notifications') : select('notifications')} className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-orange-50 hover:text-brand-500"><Icon name="bell"/><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500"/></button><button onClick={() => onPopup ? onPopup('profile-menu') : select('profile')} className="flex items-center gap-2 text-left"><img className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-100" src={assets[data.avatar]} alt={`${data.name} profile`}/><span className="hidden md:block"><b className="block text-sm text-slate-800">{data.name}</b><small className="text-slate-500">{data.role}</small></span></button></div></header>
      <div className="p-4 md:p-8">{children}</div>
    </main>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white px-1 py-2 md:hidden">{data.navigation.slice(0, 5).map(item => <button onClick={() => select(item.key)} className={`grid min-w-13 place-items-center gap-1 rounded-lg px-2 py-1 text-[10px] ${active === item.key ? 'font-bold text-brand-500' : 'text-slate-500'}`} key={item.key}><Icon name={item.icon} className="h-4 w-4"/>{item.mobile || item.label}</button>)}</nav>
  </div>;
}
