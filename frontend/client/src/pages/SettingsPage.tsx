import { useState, useEffect } from 'react';
import { Save, Megaphone, Layout as LayoutIcon, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';

interface SiteSettings {
  announcement_text: string;
  is_announcement_active: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // جلب الإعدادات الحالية
  useEffect(() => {
    apiClient.get('/site-settings/')
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.patch('/site-settings/', settings);
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات العامة بنجاح' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'فشل حفظ الإعدادات' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout title="الإعدادات"><div className="text-center py-10">جاري التحميل...</div></Layout>;

  return (
    <Layout title="إعدادات الموقع">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutIcon className="text-emerald-600" />
            إدارة المنصة
          </h2>
          <p className="text-gray-500 text-sm">تحكم في خصائص الموقع العامة</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* بطاقة: الإعلان العاجل */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Megaphone size={20} className="text-orange-500" />
              شريط الإعلانات العاجلة
            </h3>
            
            {/* زر التبديل (Toggle Switch) */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings?.is_announcement_active || false}
                onChange={(e) => setSettings(prev => prev ? ({ ...prev, is_announcement_active: e.target.checked }) : null)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="mr-3 text-sm font-medium text-gray-700">
                {settings?.is_announcement_active ? 'مفعّل' : 'معطّل'}
              </span>
            </label>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">نص الإعلان</label>
              <input
                type="text"
                value={settings?.announcement_text || ''}
                onChange={(e) => setSettings(prev => prev ? ({ ...prev, announcement_text: e.target.value }) : null)}
                placeholder="مثال: تنبيه هام: لا توجد دروس يوم الجمعة القادم..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                * سيظهر هذا الشريط في أعلى الصفحة الرئيسية لجميع الزوار والطلاب.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>

        {/* (مكان لجدول الدروس لاحقاً) */}

      </div>
    </Layout>
  );
}