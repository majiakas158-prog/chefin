import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { routes } from './routes';

export default function App() {
  return <HashRouter><Routes>{routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}<Route path="*" element={<Navigate to="/" replace />} /></Routes></HashRouter>;
}
