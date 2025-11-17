import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. [تغيير] استيراد "الخطاف"
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 2. [تغيير] استخدام "الخطاف" للحصول على دالة login
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/login/', 
        {
          username: username,
          password: password,
        }
      );

      const token = response.data.token;

      // 3. [تغيير] استخدام دالة login المركزية بدلاً من localStorage
      login(token); 

      console.log('تم تسجيل الدخول بنجاح. التوكن:', token);

      // 4. [تغيير] إعادة التوجيه إلى لوحة التحكم بدلاً من الرئيسية
      navigate('/dashboard');

    } catch (err: any) {
      console.error('فشل تسجيل الدخول:', err.response.data);
      setError('فشل تسجيل الدخول. (اسم المستخدم أو كلمة المرور غير صحيحة)');
    }
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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