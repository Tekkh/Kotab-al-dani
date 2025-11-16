import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // 1. استيراد لوحة التحكم
import ProtectedRoute from './components/ProtectedRoute'; // 2. استيراد الحارس
import './App.css';

function App() {
  // (مؤقتاً) سنفترض أننا بحاجة لمعرفة حالة تسجيل الدخول لإظهار الروابط الصحيحة
  // (هذه طريقة بسيطة، سنحسنها لاحقاً)
  const isLoggedIn = !!localStorage.getItem('authToken');

  return (
    <>
      {/* 1. قائمة تنقل محدثة */}
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">لوحة التحكم</Link> | 
            {/* زر تسجيل الخروج سيكون داخل لوحة التحكم */}
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

      {/* 2. تحديث الروابط لاستخدام الحارس */}
      <Routes>
        {/* الروابط العامة */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* الروابط المحمية (التي تتطلب تسجيل الدخول) */}
        <Route element={<ProtectedRoute />}>
          {/* أي صفحة تضعها هنا ستكون محمية */}
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* (لاحقاً سنضيف /profile و /progress هنا) */}
        </Route>
      </Routes>
    </>
  );
}

export default App;