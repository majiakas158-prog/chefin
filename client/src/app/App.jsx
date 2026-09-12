import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { CompleteProfilePage } from '../pages/CompleteProfilePage';
import { OpportunityDetailsPage } from '../pages/OpportunityDetailsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />

          {/* Protected routes — require auth + email verified */}
          <Route
            path="/chef-dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage type="chef" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant-dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage type="restaurant" />
              </ProtectedRoute>
            }
          />

          {/* Chef MVP pages */}
          <Route path="/chef/dashboard" element={<ProtectedRoute><DashboardPage type="chef" /></ProtectedRoute>} />
          <Route path="/chef/jobs" element={<ProtectedRoute><DashboardPage type="chef" initialActive="discover" /></ProtectedRoute>} />
          <Route path="/chef/job-details" element={<ProtectedRoute><OpportunityDetailsPage type="chef" /></ProtectedRoute>} />
          <Route path="/chef/applications" element={<ProtectedRoute><DashboardPage type="chef" initialActive="applications" /></ProtectedRoute>} />
          <Route path="/chef/chat" element={<ProtectedRoute><DashboardPage type="chef" initialActive="messages" /></ProtectedRoute>} />
          <Route path="/chef/profile" element={<ProtectedRoute><DashboardPage type="chef" initialActive="profile" /></ProtectedRoute>} />
          <Route path="/chef/saved" element={<ProtectedRoute><DashboardPage type="chef" initialActive="saved" /></ProtectedRoute>} />
          <Route path="/chef/notifications" element={<ProtectedRoute><DashboardPage type="chef" initialActive="notifications" /></ProtectedRoute>} />

          {/* Restaurant MVP pages */}
          <Route path="/restaurant/dashboard" element={<ProtectedRoute><DashboardPage type="restaurant" /></ProtectedRoute>} />
          <Route path="/restaurant/chefs" element={<ProtectedRoute><DashboardPage type="restaurant" initialActive="discover" /></ProtectedRoute>} />
          <Route path="/restaurant/chef-profile" element={<ProtectedRoute><OpportunityDetailsPage type="restaurant" /></ProtectedRoute>} />
          <Route path="/restaurant/post-job" element={<ProtectedRoute><DashboardPage type="restaurant" initialActive="post" /></ProtectedRoute>} />
          <Route path="/restaurant/applications" element={<ProtectedRoute><DashboardPage type="restaurant" initialActive="applications" /></ProtectedRoute>} />
          <Route path="/restaurant/chat" element={<ProtectedRoute><DashboardPage type="restaurant" initialActive="messages" /></ProtectedRoute>} />
          <Route path="/restaurant/profile" element={<ProtectedRoute><DashboardPage type="restaurant" initialActive="profile" /></ProtectedRoute>} />
          <Route path="/restaurant/shortlist" element={<ProtectedRoute><DashboardPage type="restaurant" initialActive="saved" /></ProtectedRoute>} />
          <Route path="/restaurant/notifications" element={<ProtectedRoute><DashboardPage type="restaurant" initialActive="notifications" /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
