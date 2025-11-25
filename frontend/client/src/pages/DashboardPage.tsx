import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import LogWirdModal from '../components/LogWirdModal';
import MusafView from '../components/MusafView';
import Layout from '../components/Layout';
import { Trophy, Star, Zap } from 'lucide-react';

// 1. [جديد] استيراد النافذة الجديدة
import PreviousProgressModal from '../components/PreviousProgressModal';

interface ProgressLog {
  id: number;
  log_type: string;
  date: string;
  quantity_description: string;
  self_notes: string | null;
}

interface UserProfile {
  username: string;
  total_xp: number;
  level: number;
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // حالة نافذة تسجيل الورد اليومي
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. [جديد] حالة نافذة الرصيد السابق
  const [isPrevModalOpen, setIsPrevModalOpen] = useState(false);

  const fetchData = () => {
    apiClient.get('/progress-logs/').then(res => setLogs(res.data));
    apiClient.get('/my-profile/').then(res => setProfile(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLevelProgress = () => {
    if (!profile) return 0;
    const currentLevelXP = (profile.level - 1) * 100;
    const nextLevelXP = profile.level * 100;
    const progress = ((profile.total_xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const handleDeleteLog = async (id: number) => {
    if (!window.confirm("هل أنت متأكد؟")) return;
    try {
      await apiClient.delete(`/progress-logs/${id}/`);
      setLogs(logs.filter(log => log.id !== id));
      fetchData(); 
    } catch (err) { console.error(err); }
  };

  return (
    <Layout title="لوحة التحكم">
      {/* النوافذ المنبثقة (Modals) - نضعها هنا في البداية لتكون منظمة */}
      <LogWirdModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onLogCreated={fetchData} 
      />

      {/* 3. [جديد] إضافة النافذة في الكود (تكون مخفية حتى نطلبها) */}
      <PreviousProgressModal 
        isOpen={isPrevModalOpen}
        onRequestClose={() => setIsPrevModalOpen(false)}
        onSuccess={fetchData} // عند النجاح نعيد تحميل البيانات لتحديث النقاط
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- العمود الأيمن --- */}
        <div className="space-y-6">
          
          {/* بطاقة المستوى */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={120} /></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">المستوى الحالي</p>
                  <h2 className="text-3xl font-bold">{profile?.level || 1}</h2>
                  <p className="text-xs text-emerald-200 mt-1">طالب مجتهد</p> 
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Star className="text-yellow-300 fill-yellow-300" size={24} />
                </div>
              </div>

              <div className="mb-2 flex justify-between text-xs text-emerald-100">
                <span>{profile?.total_xp || 0} XP</span>
                <span>الهدف: {profile ? profile.level * 100 : 100} XP</span>
              </div>
              
              {/* شريط التقدم */}
              <div className="h-2 bg-black/20 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>

              {/* 4. [جديد] الزر الذي يفتح النافذة */}
              <button 
               onClick={() => setIsPrevModalOpen(true)}
               className="text-xs text-emerald-200 hover:text-white underline opacity-80 hover:opacity-100 transition-opacity w-full text-right"
              >
               + إضافة رصيد حفظ سابق
              </button>

            </div>
          </div>

          {/* زر التسجيل */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-3 rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              تسجيل وِرد جديد
            </button>
          </div>

          {/* سجل الأوراد */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 px-2">آخر الأوراد</h3>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar px-1">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">لا توجد سجلات بعد</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="group relative bg-gray-50 hover:bg-emerald-50 p-3 rounded-xl transition-colors border border-transparent hover:border-emerald-100">
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="absolute left-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      🗑️
                    </button>
                    <div className="flex justify-between text-gray-500 text-xs mb-1 font-medium">
                      <span>{log.date}</span>
                      <span className={log.log_type === 'memorization' ? 'text-emerald-600' : 'text-blue-600'}>
                        {log.log_type === 'memorization' ? 'حفظ' : 'مراجعة'}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">{log.quantity_description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- العمود الأيسر: المصحف --- */}
        <div className="lg:col-span-2">
          <MusafView />
        </div>

      </div>
    </Layout>
  );
}