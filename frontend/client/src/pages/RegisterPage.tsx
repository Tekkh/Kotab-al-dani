import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  // 1. "حالات" (States) لتخزين مدخلات المستخدم
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 2. أداة "الموجّه" (Router) لإعادة توجيه المستخدم بعد النجاح
  const navigate = useNavigate();

  // 3. الدالة التي سيتم استدعاؤها عند إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة الافتراضية
    setError(null); // إعادة تعيين الأخطاء

    // 4. إرسال البيانات إلى الـ API الذي قمنا ببنائه
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/register/', 
        {
          username: username,
          email: email,
          password: password,
        }
      );

      // 5. إذا نجح التسجيل (الخادم سيعيد 201)
      console.log('تم إنشاء المستخدم:', response.data);
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      navigate('/login');

    } catch (err: any) {
      // 6. إذا فشل التسجيل (مثل: اسم مستخدم موجود)
      console.error('فشل التسجيل:', err.response.data);
      setError('فشل التسجيل. (اسم المستخدم أو البريد الإلكتروني قد يكون مستخدماً)');
    }
  };

  return (
    <div>
      <h2>إنشاء حساب جديد</h2>
      {/* 7. عرض رسالة الخطأ إذا وجدت */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 8. نموذج التسجيل */}
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
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">إنشاء حساب</button>
      </form>
    </div>
  );
}