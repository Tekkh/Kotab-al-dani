import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  // 1. "حالات" (States) لتخزين مدخلات المستخدم
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // 2. الدالة التي سيتم استدعاؤها عند إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 3. إرسال البيانات إلى الـ API الذي قمنا ببنائه
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/login/', 
        {
          username: username,
          password: password,
        }
      );

      // 4. إذا نجح تسجيل الدخول (الخادم سيعيد 200)
      const token = response.data.token;
      console.log('تم تسجيل الدخول بنجاح. التوكن:', token);

      // 5. [هام جداً] حفظ التوكن في المتصفح (LocalStorage)
      // هذا هو "المفتاح" الذي سنستخدمه في جميع الطلبات القادمة
      localStorage.setItem('authToken', token);

      // 6. إعادة توجيه المستخدم إلى الصفحة الرئيسية
      navigate('/');

    } catch (err: any) {
      // 7. إذا فشل تسجيل الدخول (مثل: كلمة مرور خاطئة)
      console.error('فشل تسجيل الدخول:', err.response.data);
      setError('فشل تسجيل الدخول. (اسم المستخدم أو كلمة المرور غير صحيحة)');
    }
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      {/* 8. عرض رسالة الخطأ إذا وجدت */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 9. نموذج تسجيل الدخول */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>اسم المستخدم:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>كلمة المرور:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">دخول</button>
      </form>
    </div>
  );
}