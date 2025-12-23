import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import LibraryPage from './pages/LibraryPage';
import SupervisorPage from './pages/SupervisorPage';
import BadgesPage from './pages/BadgesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import RecitationsPage from './pages/RecitationsPage';
import SupervisorReviewPage from './pages/SupervisorReviewPage';

function App() {
  return (
    <Routes>
      {/* الروابط العامة */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

      {/* الروابط المحمية */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/supervisor" element={<SupervisorPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/recitations" element={<RecitationsPage />} />
        <Route path="/supervisor/review/:id" element={<SupervisorReviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;