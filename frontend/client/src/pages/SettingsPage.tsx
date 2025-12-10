import { useState, useEffect } from 'react';
import { 
  Save, Megaphone, User, Loader2, ShieldCheck, 
  Calendar, Clock, Plus, Edit2, Trash2, X, CheckCircle 
} from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';

// --- الواجهات (Interfaces) ---
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

interface Lesson {
  id?: number;
  day_of_week: string;
  time_description: string;
  lesson_title: string;
  is_active: boolean;
  order: number;
}

export default function SettingsPage() {
  // --- الحالات (State) ---
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  
  // حالات التحميل
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  // حالة المودال (النافذة المنبثقة) للدروس
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson>({ 
    day_of_week: '', time_description: '', lesson_title: '', is_active: true, order: 0 
  });
  const [savingLesson, setSavingLesson] = useState(false);

  // رسائل التنبيه
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- جلب البيانات ---
  const fetchData = async () => {
    try {
      const [settingsRes, profileRes, lessonsRes] = await Promise.all([
        apiClient.get('/site-settings/'),
        apiClient.get('/my-profile/'),
        apiClient.get('/lessons/') // جلب الدروس
      ]);
      
      setSettings(settingsRes.data);
      setProfile(profileRes.data);
      setLessons(lessonsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- دوال الحفظ والتحديث ---

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    setMessage(null);
    try {
      await apiClient.patch('/my-profile/', {
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
      setMessage({ type: 'success', text: 'تم تحديث بياناتك الشخصية' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل تحديث البيانات الشخصية' });
    } finally {
      setSavingProfile(false);
    }
  };

  // --- دوال إدارة الدروس ---

  const openLessonModal = (lesson?: Lesson) => {
    if (lesson) {
      setCurrentLesson(lesson);
    } else {
      // درس جديد
      setCurrentLesson({ day_of_week: '', time_description: '', lesson_title: '', is_active: true, order: lessons.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLesson(true);
    try {
      if (currentLesson.id) {
        // تعديل
        await apiClient.put(`/lessons/${currentLesson.id}/`, currentLesson);
        setMessage({ type: 'success', text: 'تم تعديل الدرس بنجاح' });
      } else {
        // إضافة جديد
        await apiClient.post('/lessons/', currentLesson);
        setMessage({ type: 'success', text: 'تم إضافة الدرس الجديد' });
      }
      setIsModalOpen(false);
      fetchData(); // إعادة تحميل البيانات
    } catch (err) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الدرس' });
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الدرس نهائياً؟")) return;
    try {
      await apiClient.delete(`/lessons/${id}/`);
      setLessons(lessons.filter(l => l.id !== id));
      setMessage({ type: 'success', text: 'تم حذف الدرس' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل الحذف' });
    }
  };

  const handleToggleLessonActive = async (lesson: Lesson) => {
    try {
      const newStatus = !lesson.is_active;
      await apiClient.patch(`/lessons/${lesson.id}/`, { is_active: newStatus });
      // تحديث الواجهة محلياً للسرعة
      setLessons(lessons.map(l => l.id === lesson.id ? { ...l, is_active: newStatus } : l));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Layout title="الإعدادات"><div className="text-center py-10">جاري التحميل...</div></Layout>;

  return (
    <Layout title="إعدادات المشرف">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" />
              لوحة الإدارة
            </h2>
            <p className="text-gray-500 text-sm">تحكم كامل في إعدادات المنصة والجدول الدراسي</p>
          </div>
        </div>

        {/* رسائل التنبيه */}
        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <CheckCircle size={18} />
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. العمود الأيمن: الملف الشخصي */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <h3 className="font-bold text-gray-800">بياناتي الشخصية</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">الاسم الأول</label>
                  <input
                    type="text"
                    value={profile?.first_name || ''}
                    onChange={(e) => setProfile(prev => prev ? ({ ...prev, first_name: e.target.value }) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">الاسم العائلي</label>
                  <input
                    type="text"
                    value={profile?.last_name || ''}
                    onChange={(e) => setProfile(prev => prev ? ({ ...prev, last_name: e.target.value }) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">اسم المستخدم</label>
                  <input type="text" value={profile?.username} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed text-sm" />
                </div>
                
                <button type="submit" disabled={savingProfile} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors disabled:opacity-70 text-sm">
                  {savingProfile ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  تحديث بياناتي
                </button>
              </form>
            </div>
          </div>

          {/* 2. العمود الأيسر: إعدادات الموقع + الجدول */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* أ) شريط الإعلانات */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-white px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Megaphone size={20} className="text-orange-500" />
                  شريط الإعلانات العاجلة
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings?.is_announcement_active || false} onChange={(e) => setSettings(prev => prev ? ({ ...prev, is_announcement_active: e.target.checked }) : null)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div className="p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={settings?.announcement_text || ''}
                    onChange={(e) => setSettings(prev => prev ? ({ ...prev, announcement_text: e.target.value }) : null)}
                    placeholder="اكتب هنا الإعلان..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                  <button onClick={handleSaveSettings} disabled={savingSettings} className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 whitespace-nowrap">
                    {savingSettings ? <Loader2 className="animate-spin" size={18} /> : 'حفظ'}
                  </button>
                </div>
              </div>
            </div>

            {/* ب) إدارة الجدول الأسبوعي */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Calendar size={20} className="text-emerald-600" />
                  <span className="hidden sm:inline">إدارة الجدول الأسبوعي</span>
                  <span className="sm:hidden">جدول الدروس الأسبوعي</span>
                </h3>
                <button 
                  onClick={() => openLessonModal()}
                  className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors font-bold"
                >
                  <Plus size={16} /> <span className="hidden sm:inline">إضافة درس</span><span className="sm:hidden">إضافة</span>
                </button>
              </div>

              <div className="p-0">
                {/* 1. عرض الموبايل (بطاقات) - يظهر فقط في الشاشات الصغيرة */}
                <div className="md:hidden space-y-4 p-4">
                  {lessons.length > 0 ? lessons.map((lesson) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3">
                      
                      {/* رأس البطاقة: اليوم والحالة */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                          {lesson.day_of_week}
                        </span>
                        <button 
                          onClick={() => handleToggleLessonActive(lesson)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lesson.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {lesson.is_active ? 'نشط' : 'معطل'}
                        </button>
                      </div>

                      {/* محتوى الدرس */}
                      <div>
                        <h4 className="font-bold text-emerald-700 text-lg mb-1">{lesson.lesson_title}</h4>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock size={14} />
                          <span>{lesson.time_description}</span>
                        </div>
                      </div>

                      {/* أزرار التحكم */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button 
                          onClick={() => openLessonModal(lesson)} 
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 size={16} /> تعديل
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(lesson.id!)} 
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} /> حذف
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 py-4">لا توجد دروس حالياً</p>
                  )}
                </div>

                {/* 2. عرض الحاسوب (جدول) - يظهر فقط في الشاشات المتوسطة والكبيرة */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3">اليوم</th>
                        <th className="px-6 py-3">التوقيت</th>
                        <th className="px-6 py-3">عنوان الدرس</th>
                        <th className="px-6 py-3 text-center">الحالة</th>
                        <th className="px-6 py-3 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {lessons.length > 0 ? lessons.map((lesson) => (
                        <tr key={lesson.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800">{lesson.day_of_week}</td>
                          <td className="px-6 py-4 text-gray-600">{lesson.time_description}</td>
                          <td className="px-6 py-4 text-emerald-700 font-medium">{lesson.lesson_title}</td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleToggleLessonActive(lesson)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lesson.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                              {lesson.is_active ? 'نشط' : 'معطل'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => openLessonModal(lesson)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteLesson(lesson.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-400">لا توجد دروس مضافة حالياً</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- Modal (نافذة إضافة/تعديل الدرس) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">
                  {currentLesson.id ? 'تعديل الدرس' : 'إضافة درس جديد'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSaveLesson} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">اليوم</label>
                  <select 
                    value={currentLesson.day_of_week}
                    onChange={(e) => setCurrentLesson({...currentLesson, day_of_week: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  >
                    <option value="">اختر اليوم...</option>
                    <option value="السبت">السبت</option>
                    <option value="الأحد">الأحد</option>
                    <option value="الاثنين">الاثنين</option>
                    <option value="الثلاثاء">الثلاثاء</option>
                    <option value="الأربعاء">الأربعاء</option>
                    <option value="الخميس">الخميس</option>
                    <option value="الجمعة">الجمعة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">التوقيت</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentLesson.time_description}
                      onChange={(e) => setCurrentLesson({...currentLesson, time_description: e.target.value})}
                      placeholder="مثال: بعد صلاة العصر"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none pl-10"
                      required
                    />
                    <Clock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">عنوان الدرس / النشاط</label>
                  <input
                    type="text"
                    value={currentLesson.lesson_title}
                    onChange={(e) => setCurrentLesson({...currentLesson, lesson_title: e.target.value})}
                    placeholder="مثال: تصحيح التلاوة"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={currentLesson.is_active}
                    onChange={(e) => setCurrentLesson({...currentLesson, is_active: e.target.checked})}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 select-none">عرض هذا الدرس للطلاب حالياً</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    disabled={savingLesson}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {savingLesson ? <Loader2 className="animate-spin" size={18} /> : 'حفظ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}