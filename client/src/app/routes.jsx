import { DashboardPage } from '../pages/DashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';

export const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/signin', element: <SignInPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/chef-dashboard', element: <DashboardPage type="chef" /> },
  { path: '/restaurant-dashboard', element: <DashboardPage type="restaurant" /> },
];
