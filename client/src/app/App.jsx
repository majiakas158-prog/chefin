import { useHashRoute } from '../hooks/useHashRoute';
import { routes } from './routes';

export default function App() {
  const route = useHashRoute();
  const Page = routes[route] ?? routes['/'];

  return <Page />;
}
