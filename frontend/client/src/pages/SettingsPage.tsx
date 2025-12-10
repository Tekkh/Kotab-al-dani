import { useState, useEffect } from 'react';
import { Save, Megaphone, Layout as LayoutIcon, User, Loader2, ShieldCheck } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';

interface SiteSettings {
  announcement_text: string;
  is_announcement_active: boolean;
}

interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function SettingsPage() {
  // حالات البيانات
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // حالات التحميل والحفظ
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // جلب البيانات عند التحميل
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب الإعدادات والبروفايل معاً
        const [settingsRes, profileRes] = await Promise.all([
          apiClient.get('/site-settings/'),
          apiClient.get('/my-profile/')
        ]);
        
        setSettings(settingsRes.data);
        setProfile(profileRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة حفظ إعدادات الموقع
  const handleSaveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    setMessage(null);
    try {
      await apiClient.patch('/site-settings/', settings);
      setMessage({ type: 'success', text: 'تم تحديث إعدادات المنصة' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل حفظ الإعدادات' });
    } finally {
      setSavingSettings(false);
    }
  };

  // دالة حفظ الملف الشخصي
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    setMessage(null);
    try {
      await apiClient.patch('/my-profile/', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        // (لا نرسل الهدف اليومي هنا لأن المشرف لا يحتاجه)
      });
      setMessage({ type: 'success', text: 'تم تحديث بياناتك الشخصية' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل تحديث البيانات الشخصية' });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) return <Layout title="الإعدادات"><div className="text-center py-10">جاري التحميل...</div></Layout>;

  return (
    <Layout title="إعدادات المشرف">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" />
              لوحة الإدارة
            </h2>
            <p className="text-gray-500 text-sm">مرحباً {profile?.first_name}، أنت في وضع التحكم الكامل.</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الأيمن: الملف الشخصي للمشرف */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <h3 className="font-bold text-gray-800">بياناتي الشخصية</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول</label>
                  <input
                    type="text"
                    value={profile?.first_name || ''}
                    onChange={(e) => setProfile(prev => prev ? ({ ...prev, first_name: e.target.value }) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم العائلي</label>
                  <input
                    type="text"
                    value={profile?.last_name || ''}
                    onChange={(e) => setProfile(prev => prev ? ({ ...prev, last_name: e.target.value }) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
                  <input type="text" value={profile?.username} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors disabled:opacity-70 text-sm"
                >
                  {savingProfile ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  تحديث بياناتي
                </button>
              </form>
            </div>
          </div>

          {/* العمود الأيسر: إعدادات الموقع */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* بطاقة: الإعلان العاجل */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Megaphone size={20} className="text-orange-500" />
                  شريط الإعلانات العاجلة
                </h3>
                
                {/* زر التبديل */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings?.is_announcement_active || false}
                    onChange={(e) => setSettings(prev => prev ? ({ ...prev, is_announcement_active: e.target.checked }) : null)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">نص الإعلان</label>
                  <input
                    type="text"
                    value={settings?.announcement_text || ''}
                    onChange={(e) => setSettings(prev => prev ? ({ ...prev, announcement_text: e.target.value }) : null)}
                    placeholder="اكتب هنا الإعلان الذي سيظهر في أعلى الموقع..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70"
                  >
                    {savingSettings ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    حفظ إعدادات المنصة
                  </button>
                </div>
              </div>
            </div>

            {/* (مكان لجدول الدروس سنضيفه لاحقاً هنا) */}
            
          </div>
        </div>
      </div>
    </Layout>
  );
}