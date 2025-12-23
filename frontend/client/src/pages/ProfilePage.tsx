import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Save, Loader2, ShieldCheck, Target, Lock, AlertCircle } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';

interface UserProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  level: number;
  daily_goal: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dailyGoal, setDailyGoal] = useState('thumn');

  const [passData, setPassData] = useState({ old_password: '', new_password: '' });
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    apiClient.get('/my-profile/')
      .then(res => {
        const data = res.data;
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setDailyGoal(data.daily_goal || 'thumn');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await apiClient.patch('/my-profile/', {
        first_name: firstName,
        last_name: lastName,
        daily_goal: dailyGoal
      });
      setProfile(response.data);
      setMessage({ type: 'success', text: 'تم تحديث المعلومات بنجاح' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'فشل حفظ التغييرات' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    setPassLoading(true);
    try {
      await apiClient.post('/auth/change-password/', passData);
      setPassMsg({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح' });
      setPassData({ old_password: '', new_password: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: 'تأكد من كلمة المرور الحالية' });
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) return <Layout title="حسابي"><div className="text-center py-10">جاري التحميل...</div></Layout>;

  return (
    <Layout title="إعدادات الحساب">
      <div className="max-w-3xl mx-auto pb-20">
        
        {/* البطاقة الموحدة */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* 1. ترويسة البروفايل */}
          <div className="bg-emerald-600 h-32 relative flex justify-center">
            <div className="absolute -bottom-12">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-md">
                <span className="text-3xl font-bold uppercase">
                  {profile?.username?.charAt(0) || <User size={40} />}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 md:px-10 pb-10">
            
            {/* ملخص المستخدم */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">{profile?.username}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-200">
                    <ShieldCheck size={12} />
                    المستوى {profile?.level}
                 </span>
                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-bold border border-gray-200 dir-ltr">
                    {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('en-GB') : '...'}
                    <Calendar size={12} />
                 </span>
              </div>
            </div>

            {/* رسائل التنبيه العامة */}
            {message && (
              <div className={`p-4 rounded-xl mb-8 text-sm flex items-center justify-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            {/* --- نموذج البيانات الشخصية --- */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الأول</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none transition-all bg-gray-50/30 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم العائلي</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none transition-all bg-gray-50/30 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-2">
                  <Target size={18} />
                  الهدف اليومي للحفظ
                </label>
                <div className="relative">
                  <select
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="w-full px-4 py-3 border border-emerald-100 bg-emerald-50/30 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer font-medium text-emerald-900"
                  >
                    <option value="thumn">ثمن واحد / يوم (مستحسن)</option>
                    <option value="rub">ربع حزب / يوم (همة عالية)</option>
                    <option value="page">صفحة واحدة / يوم</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">▼</div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 shadow-sm flex items-center gap-2 text-sm"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  حفظ البيانات
                </button>
              </div>
            </form>

            {/* --- فاصل بين القسمين --- */}
            <div className="my-10 border-t border-gray-100 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-4 text-xs font-bold text-gray-400">
                    إعدادات الأمان
                </span>
            </div>

            {/* --- نموذج كلمة المرور (مدمج) --- */}
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <Lock size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">تغيير كلمة المرور</h3>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">كلمة المرور الحالية</label>
                            <input 
                                type="password" 
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all text-sm"
                                value={passData.old_password}
                                onChange={e => setPassData({...passData, old_password: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">كلمة المرور الجديدة</label>
                            <input 
                                type="password" 
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all text-sm"
                                value={passData.new_password}
                                onChange={e => setPassData({...passData, new_password: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                         {passMsg ? (
                            <span className={`text-xs font-bold ${passMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {passMsg.text}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">يجب أن تكون 8 رموز على الأقل</span>
                        )}

                        <button 
                            type="submit" 
                            disabled={passLoading}
                            className="px-5 py-2 bg-white border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200 font-bold rounded-xl transition-all disabled:opacity-50 text-xs flex items-center gap-2 shadow-sm"
                        >
                            {passLoading ? <Loader2 className="animate-spin" size={14} /> : <Lock size={14} />}
                            تحديث الكلمة
                        </button>
                    </div>
                </form>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}