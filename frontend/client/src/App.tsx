import { Routes, Route, Link } from 'react-router-dom';
// 1. [تغيير] استيراد "الخطاف"
import { useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
//import './App.css';

function App() {
  // 2. [تغيير] استخدام "السياق" لمعرفة حالة تسجيل الدخول
  const { isLoggedIn } = useAuth();

  return (
    <>
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">لوحة التحكم</Link>
            {/* (زر تسجيل الخروج موجود الآن داخل لوحة التحكم) */}
          </>
        ) : (
          <>
            <Link to="/">الرئيسية (عام)</Link> | 
            <Link to="/login">تسجيل الدخول</Link> | 
            <Link to="/register">إنشاء حساب</Link>
          </>
        )}
      </nav>

      <hr />

      <Routes>
        {/* الروابط العامة */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* الروابط المحمية */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;