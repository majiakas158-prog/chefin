import { useEffect, useState } from 'react';
const currentRoute = () => window.location.hash.slice(1) || '/';
export function useHashRoute() { const [route,setRoute] = useState(currentRoute); useEffect(() => { const update=()=>setRoute(currentRoute()); window.addEventListener('hashchange',update); return()=>window.removeEventListener('hashchange',update); },[]); return route; }
