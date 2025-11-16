import { Navigate, Outlet } from 'react-router-dom';

// هذا المكون هو "الحارس"
const ProtectedRoute = () => {
  // 1. افحص "الخزنة المحلية" (LocalStorage) بحثاً عن المفتاح
  const token = localStorage.getItem('authToken');

  // 2. إذا كان المفتاح موجوداً (المستخدم مسجل دخوله)
  if (token) {
    // اسمح له بالمرور واعرض الصفحة المطلوبة (مثل لوحة التحكم)
    return <Outlet />;
  }

  // 3. إذا لم يكن المفتاح موجوداً
  // أعد توجيهه (اطرده) إلى صفحة تسجيل الدخول
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;