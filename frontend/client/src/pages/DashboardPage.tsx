import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import LogWirdModal from '../components/LogWirdModal';
import PreviousProgressModal from '../components/PreviousProgressModal';
import CelebrationModal, { type NewBadge } from '../components/CelebrationModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import MusafView from '../components/MusafView';
import { useAuth } from '../context/AuthContext';
import SupervisorDashboard from './SupervisorDashboard';
import Layout from '../components/Layout';
import { Trophy, Star, Zap, History, Flame, Trash2 } from 'lucide-react';
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
  current_streak: number;
}

export default function DashboardPage() {

  const { isStaff } = useAuth();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrevModalOpen, setIsPrevModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [newEarnedBadges, setNewEarnedBadges] = useState<NewBadge[]>([]);

  // [جديد] حالة الحذف
  const [logToDelete, setLogToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = () => {
    apiClient.get('/progress-logs/').then(res => setLogs(res.data));
    apiClient.get('/my-profile/').then(res => setProfile(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBadgesEarned = (badges: NewBadge[]) => {
    setNewEarnedBadges(badges);
    setIsCelebrationOpen(true);
  };

  // 1. بدلاً من الحذف فوراً، نفتح النافذة ونحفظ الـ ID
  const confirmDelete = (id: number) => {
    setLogToDelete(id);
  };

  // 2. تنفيذ الحذف الفعلي عند الضغط على "نعم" في النافذة
  const executeDelete = async () => {
    if (!logToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/progress-logs/${logToDelete}/`);
      setLogs(logs.filter(log => log.id !== logToDelete));
      fetchData(); 
      setLogToDelete(null); // إغلاق النافذة
    } catch (err) { 
      console.error(err); 
      alert("فشل الحذف");
    } finally {
      setIsDeleting(false);
    }
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

  if (isStaff) {
    return (
      <Layout title="لوحة التحكم">
        <SupervisorDashboard />
      </Layout>
    );
  }

  return (
    <Layout title="لوحة التحكم">
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

      <CelebrationModal 
        isOpen={isCelebrationOpen}
        onRequestClose={() => setIsCelebrationOpen(false)}
        newBadges={newEarnedBadges}
      />

      {/* [جديد] نافذة تأكيد الحذف */}
      <DeleteConfirmModal 
        isOpen={!!logToDelete} // تفتح إذا كان هناك ID
        onRequestClose={() => setLogToDelete(null)}
        onConfirm={executeDelete}
        loading={isDeleting}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="space-y-6">
          
          {/* بطاقة المستوى */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={120} /></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">المستوى الحالي</p>
                  <h2 className="text-4xl font-bold">{profile?.level || 1}</h2>
                  <p className="text-sm text-emerald-100 mt-1 font-bold bg-white/20 px-2 py-0.5 rounded-lg w-fit">
                    {currentLevelData.name}
                  </p> 
                </div>

                <div className="flex flex-col items-end gap-2">
                   {/* أيقونة المستوى القديمة */}
                   <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm mb-1">
                      <Star className="text-yellow-300 fill-yellow-300" size={24} />
                   </div>
                   
                   {/* شارة المداومة */}
                   <div className="flex flex-col items-end gap-1">
                      <span className="text-[12px] text-emerald-200 font-medium opacity-90">
                       أيام متواصلة من الحفظ
                      </span>
                      
                      <div 
                        className="flex items-center gap-2 bg-orange-300/20 px-3 py-1.5 rounded-lg border border-orange-400/30 backdrop-blur-sm min-w-[80px] justify-center" 
                        title={`لديك ${profile?.current_streak || 0} أيام متواصلة من الحفظ`}
                      >
                        <Flame size={22} className="text-orange-400 fill-orange-400 animate-pulse shrink-0" />
                        <span className="text-base font-bold text-orange-100 font-mono leading-none pt-1">
                          {profile?.current_streak || 0}
                        </span>
                      </div>
                   </div>
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
              
              <div className="flex justify-between items-center mt-1">
                <button 
                 onClick={() => setIsPrevModalOpen(true)}
                 className="text-[10px] text-emerald-200 hover:text-white underline opacity-80 hover:opacity-100 transition-opacity"
                >
                 + رصيد سابق
                </button>
                
                <p className="text-[10px] text-right text-emerald-200">
                  {nextLevelData 
                    ? `باقي ${nextLevelData.minPoints - (profile?.total_xp || 0)} للترقية` 
                    : 'مبارك الختم!'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="col-span-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-4 rounded-2xl border border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap size={20} className="fill-emerald-700" />
              تسجيل ثمن جديد
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
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 px-2">آخر الأثمان</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar px-1">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">لا توجد سجلات بعد</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="bg-gray-50 hover:bg-emerald-50 p-3 rounded-xl transition-colors border border-transparent hover:border-emerald-100">
                    
                    {/* السطر العلوي: التاريخ يمين، والحالة والحذف يسار */}
                    <div className="flex justify-between items-center mb-1">
                      
                      {/* التاريخ */}
                      <span className="text-gray-400 text-[10px] font-mono">{log.date}</span>

                      {/* تجميعة زر الحذف والحالة */}
                      <div className="flex items-center gap-2">

                        {/*  (حفظ / مراجعة) */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          log.log_type === 'memorization' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {log.log_type === 'memorization' ? 'حفظ' : 'مراجعة'}
                        </span>
                        <button 
                          onClick={() => confirmDelete(log.id)} 
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-md"
                          title="حذف السجل"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* تفاصيل الكمية */}
                    <p className="text-gray-800 text-sm font-medium leading-relaxed">
                      {log.quantity_description}
                    </p>
                    
                    {/* الملاحظات الذاتية (تظهر فقط إن وجدت) */}
                    {log.self_notes && (
                      <p className="text-xs text-gray-500 mt-1 pr-2 border-r-2 border-gray-200 line-clamp-1">
                        {log.self_notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <MusafView />
        </div>

      </div>
    </Layout>
  );
}