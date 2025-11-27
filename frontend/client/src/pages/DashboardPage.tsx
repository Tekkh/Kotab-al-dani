import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import LogWirdModal from '../components/LogWirdModal';
import PreviousProgressModal from '../components/PreviousProgressModal';
import CelebrationModal, { type NewBadge } from '../components/CelebrationModal'; // [جديد] استيراد
import MusafView from '../components/MusafView';
import Layout from '../components/Layout';
import { Trophy, Star, Zap, History } from 'lucide-react';
import { getLevelData, getNextLevelData } from '../utils/levels';

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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrevModalOpen, setIsPrevModalOpen] = useState(false);

  // [جديد] حالات الاحتفال
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [newEarnedBadges, setNewEarnedBadges] = useState<NewBadge[]>([]);

  const fetchData = () => {
    apiClient.get('/progress-logs/').then(res => setLogs(res.data));
    apiClient.get('/my-profile/').then(res => setProfile(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // [جديد] دالة التعامل مع الأوسمة الجديدة القادمة من LogWirdModal
  const handleBadgesEarned = (badges: NewBadge[]) => {
    setNewEarnedBadges(badges);
    setIsCelebrationOpen(true); // فتح نافذة الاحتفال
    // تشغيل صوت احتفال اختياري هنا مستقبلاً
  };

  const handleDeleteLog = async (id: number) => {
    if (!window.confirm("هل أنت متأكد؟")) return;
    try {
      await apiClient.delete(`/progress-logs/${id}/`);
      setLogs(logs.filter(log => log.id !== id));
      fetchData(); 
    } catch (err) { console.error(err); }
  };

  const currentLevelData = profile ? getLevelData(profile.level) : getLevelData(1);
  const nextLevelData = profile ? getNextLevelData(profile.level) : getNextLevelData(1);
  
  const calculateProgress = () => {
    if (!profile || !nextLevelData) return 100;
    const currentPoints = profile.total_xp;
    const startPoints = currentLevelData.minPoints;
    const endPoints = nextLevelData.minPoints;
    const progress = ((currentPoints - startPoints) / (endPoints - startPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <Layout title="لوحة التحكم">
      
      {/* 1. نافذة تسجيل الورد (تم ربطها بـ handleBadgesEarned) */}
      <LogWirdModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onLogCreated={fetchData}
        onBadgesEarned={handleBadgesEarned} 
      />

      <PreviousProgressModal 
        isOpen={isPrevModalOpen}
        onRequestClose={() => setIsPrevModalOpen(false)}
        onSuccess={fetchData} 
      />

      {/* 2. [جديد] نافذة الاحتفال */}
      <CelebrationModal 
        isOpen={isCelebrationOpen}
        onRequestClose={() => setIsCelebrationOpen(false)}
        newBadges={newEarnedBadges}
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
                  <h2 className="text-4xl font-bold">{profile?.level || 1}</h2>
                  <p className="text-sm text-emerald-100 mt-1 font-bold bg-white/20 px-2 py-0.5 rounded-lg w-fit">
                    {currentLevelData.name}
                  </p> 
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Star className="text-yellow-300 fill-yellow-300" size={28} />
                </div>
              </div>

              <div className="mb-2 flex justify-between text-xs text-emerald-100 font-mono">
                <span>{profile?.total_xp || 0} نقطة</span>
                <span>الهدف: {nextLevelData ? nextLevelData.minPoints : 'ختم القرآن'}</span>
              </div>
              
              <div className="h-3 bg-black/20 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-right text-emerald-200">
                {nextLevelData 
                  ? `متبقي ${nextLevelData.minPoints - (profile?.total_xp || 0)} نقطة للترقية` 
                  : 'ما شاء الله، لقد أتممت المستويات!'}
              </p>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="col-span-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-4 rounded-2xl border border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap size={20} className="fill-emerald-700" />
              تسجيل وِرد جديد
            </button>
            
            <button 
              onClick={() => setIsPrevModalOpen(true)}
              className="col-span-2 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:text-emerald-600 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all"
            >
              <History size={16} />
              <span>إضافة رصيد حفظ سابق؟</span>
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
                    <button onClick={() => handleDeleteLog(log.id)} className="absolute left-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
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