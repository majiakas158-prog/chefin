import { useHashRoute } from '../hooks/useHashRoute';
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { DashboardPage } from '../pages/DashboardPage';
export default function App(){const route=useHashRoute();if(route==='/signin')return <SignInPage/>;if(route==='/signup')return <SignUpPage/>;if(route==='/chef-dashboard')return <DashboardPage type="chef"/>;if(route==='/restaurant-dashboard')return <DashboardPage type="restaurant"/>;return <LandingPage/>}
