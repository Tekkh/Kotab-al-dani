import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/password-reset/', { email });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-cairo" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-gray-800">نسيت كلمة المرور؟</h2>
           <p className="text-gray-500 text-sm mt-2">أدخل بريدك الإلكتروني لاستعادة حسابك</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 outline-none text-left"
                  placeholder="name@example.com"
                  dir="ltr"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Mail className="absolute right-3 top-3.5 text-gray-400" size={20} />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-70">
              {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-emerald-600 flex items-center justify-center gap-1">
                <ArrowRight size={16} />
                عودة لتسجيل الدخول
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تفقد بريدك الإلكتروني</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              إذا كان هذا البريد مسجلاً لدينا، فقد أرسلنا لك رابطاً لتعيين كلمة مرور جديدة.
            </p>
            <Link to="/login" className="text-emerald-600 font-bold hover:underline">
              العودة لصفحة الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}