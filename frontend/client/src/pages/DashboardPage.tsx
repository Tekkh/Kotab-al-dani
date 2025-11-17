import { useNavigate } from 'react-router-dom';

// 1. [تغيير] استيراد "الخطاف"
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();

  // 2. [تغيير] استخدام "الخطاف" للحصول على دالة logout
  const { logout } = useAuth();

  // 3. [تغيير] الدالة تستدعي "logout" من السياق
  const handleLogout = () => {
    logout(); // حذف المفتاح وتحديث "الحالة"
    navigate('/login'); // اذهب إلى صفحة تسجيل الدخول
  };

  return (
    <div>
      <h1>أهلاً بك في لوحة التحكم (محمية)</h1>
      <p>هذه الصفحة لا يمكن الوصول إليها إلا إذا كنت مسجلاً دخولك.</p>
      <button onClick={handleLogout}>تسجيل الخروج</button>
    </div>
  );
}