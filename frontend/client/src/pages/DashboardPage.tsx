import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  // دالة لتسجيل الخروج (حذف المفتاح وإعادة التوجيه)
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // حذف المفتاح
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