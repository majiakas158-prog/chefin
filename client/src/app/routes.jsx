import { DashboardPage } from '../pages/DashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';

export const routes = {
  '/': LandingPage,
  '/signin': SignInPage,
  '/signup': SignUpPage,
  '/chef-dashboard': () => <DashboardPage type="chef" />,
  '/restaurant-dashboard': () => <DashboardPage type="restaurant" />,
};
