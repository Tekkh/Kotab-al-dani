import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }
    
    setStatus('loading');
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/password-reset/confirm/', {
        uid,
        token,
        new_password: newPassword
      });
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-cairo text-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full animate-scale-in">
           <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">تم التغيير بنجاح!</h2>
            <p className="text-gray-500 text-sm">يتم تحويلك لصفحة الدخول الآن...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-cairo" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-gray-800">كلمة مرور جديدة</h2>
           <p className="text-gray-500 text-sm mt-1">أنشئ كلمة مرور قوية لحسابك</p>
        </div>

        {status === 'error' && (
           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2 border border-red-100">
             <AlertCircle size={18} />
             <span>الرابط منتهي الصلاحية أو غير صالح.</span>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
             <div className="relative">
               <input
                 type="password"
                 required
                 className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 outline-none"
                 value={newPassword}
                 onChange={e => setNewPassword(e.target.value)}
                 dir="ltr"
               />
               <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد كلمة المرور</label>
             <div className="relative">
               <input
                 type="password"
                 required
                 className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 outline-none"
                 value={confirmPassword}
                 onChange={e => setConfirmPassword(e.target.value)}
                 dir="ltr"
               />
               <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
             </div>
           </div>

           <button disabled={status === 'loading'} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-md">
             {status === 'loading' ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
           </button>
        </form>
      </div>
    </div>
  );
}