import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
  return (
    <>
      {/* 1. قائمة تنقل بسيطة للروابط */}
      <nav>
        <Link to="/">الرئيسية</Link> | 
        <Link to="/login">تسجيل الدخول</Link> | 
        <Link to="/register">إنشاء حساب</Link>
      </nav>

      <hr />

      {/* 2. المكان الذي سيعرض فيه "الموجّه" الصفحة الصحيحة */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;