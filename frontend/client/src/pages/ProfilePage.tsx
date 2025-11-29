import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Save, Loader2, ShieldCheck } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';

interface UserProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  level: number;
  // أضفنا الحقول الاختيارية لتجنب أخطاء TypeScript
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // حالات النموذج
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    apiClient.get('/my-profile/')
      .then(res => {
        console.log("بيانات البروفايل المستلمة:", res.data); // [تشخيص] لنرى البيانات في الكونسول
        const data = res.data;
        setProfile(data);
        // التأكد من تعيين القيم حتى لو كانت فارغة
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setLoading(false);
      })
      .catch(err => {
        console.error("فشل جلب البروفايل:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // نرسل فقط الحقول التي نريد تحديثها
      const payload = {
        first_name: firstName,
        last_name: lastName
      };

      const response = await apiClient.patch('/my-profile/', payload);

      console.log("رد التحديث:", response.data);
      setProfile(response.data); // تحديث الحالة بالبيانات الجديدة
      setMessage({ type: 'success', text: 'تم تحديث المعلومات بنجاح' });
    } catch (err: any) {
      console.error("فشل التحديث:", err.response?.data || err);
      setMessage({ type: 'error', text: 'فشل حفظ التغييرات. تأكد من الاتصال.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout title="حسابي"><div className="text-center py-10">جاري التحميل...</div></Layout>;

  return (
    <Layout title="إعدادات الحساب">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* رأس الصفحة الأخضر */}
        <div className="bg-emerald-600 h-32 relative flex justify-center">
          <div className="absolute -bottom-12">
             {/* صورة ثابتة (أيقونة) */}
            <div className="w-24 h-24 rounded-full border-4 border-white bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-md">
              <User size={48} />
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8 text-center md:text-right">
          {/* اسم المستخدم والمستوى - تأكد من وجود البيانات */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{profile?.username || 'مستخدم'}</h2>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold mt-2 border border-yellow-200">
               <ShieldCheck size={12} />
               المستوى {profile?.level || 1}
            </span>
          </div>

          {message && (
            <div className={`p-3 rounded-lg mb-6 text-sm text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الأول</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="أدخل اسمك الأول"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم العائلي</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="أدخل اسم العائلة"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">البريد الإلكتروني</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed">
                  <Mail size={18} />
                  {/* عرض الإيميل */}
                  <span className="dir-ltr">{profile?.email || '...'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">تاريخ الانضمام</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed">
                  <Calendar size={18} />
                  {/* عرض التاريخ مع معالجة الحالة الفارغة */}
                  <span>
                    {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('ar-MA') : '...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 shadow-sm mx-auto md:mx-0"
              >
                {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                <span>حفظ المعلومات</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}