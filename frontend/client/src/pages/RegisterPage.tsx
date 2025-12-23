import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 4) {
      setError('اسم المستخدم قصير جداً (4 أحرف على الأقل).');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('اسم المستخدم يجب أن يكون باللاتينية (A-Z) والأرقام فقط.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 خانات على الأقل.');
      return;
    }
    if (!/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setError('كلمة المرور يجب أن تحتوي على رقم ورمز خاص (!@#$).');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/auth/register/', 
        { username, email, password, confirm_password: confirmPassword }
      );
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      const serverError = err.response?.data;
      if (serverError) {
        const firstKey = Object.keys(serverError)[0];
        const msg = Array.isArray(serverError[firstKey]) ? serverError[firstKey][0] : serverError[firstKey];
        setError(`خطأ: ${msg}`);
      } else {
        setError('فشل التسجيل. تأكد من الاتصال.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-cairo" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        
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
          <h2 className="text-2xl font-bold text-emerald-800 mb-1">حساب جديد</h2>
          <p className="text-gray-500 text-sm">انضم إلينا في رحلة حفظ كتاب الله</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm border border-red-100 flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">اسم المستخدم (باللاتينية)</label>
            <input
              type="text"
              dir="ltr"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-left"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              dir="ltr"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-left"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
              <input
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">تأكيد الكلمة</label>
              <input
                type="password"
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-400 px-1">
            * يجب أن تحتوي على 8 رموز، رقم، ورمز خاص (!@#$)
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md disabled:opacity-70"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  );
}