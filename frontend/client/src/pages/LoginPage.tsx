import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/login/', 
        { username, password }
      );
      login(response.data.token, response.data.is_staff);
      navigate('/dashboard');
    } catch (err: any) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-600" size={28} />
            <span className="font-bold text-gray-800 text-lg hidden sm:block">كُتّاب الداني</span>
          </div>
          
          <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-emerald-600 transition-colors text-sm font-medium">
            <span>الرئيسية</span>
            <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">تسجيل الدخول</h2>
          <p className="text-gray-500">أهلاً بك مجدداً في رحلة الحفظ</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>

          {/* رابط نسيت كلمة المرور */}
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              هل نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
          >
            دخول
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            إنشاء حساب جديد
          </Link>
        </div>

      </div>
    </div>
  );
}