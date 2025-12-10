import { useState, useEffect } from 'react';
import { Users, Activity, Layers, Award, CheckCircle2, Clock } from 'lucide-react';
import apiClient from '../api/apiClient';
// [تصحيح] استيراد المكون الصحيح (تأكد من المسار حسب هيكلة مشروعك)
import MushafView from '../components/MusafView'; 

// واجهات البيانات
interface DashboardStats {
  total_students: number;
  active_today: number;
  total_ahzab: number;
}

interface ActivityItem {
  type: 'progress' | 'badge';
  student_name: string;
  description: string;
  timestamp: string;
}

export default function SupervisorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feed, setFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة مساعدة لحساب الوقت المنقضي
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'منذ لحظات';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return 'منذ يوم أو أكثر';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/supervisor/dashboard/');
        setStats(res.data.stats);
        setFeed(res.data.feed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">جاري تحميل بيانات الكُتّاب...</div>;

  return (
    <div className="space-y-8 pb-20"> {/* pb-20 لتجنب تغطية الشريط السفلي في الموبايل */}
      
      {/* 1. شريط العدادات (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* بطاقة 1: مجتمع الحفظة */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold mb-1">مجتمع الحفظة</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats?.total_students}</h3>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-2 inline-block">طالب مسجل</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        {/* بطاقة 2: النشاط اليومي */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold mb-1">النشاط اليوم</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats?.active_today}</h3>
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-2 inline-block">طالب نشط (24س)</span>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <Activity size={24} />
          </div>
        </div>

        {/* بطاقة 3: حصاد الكُتّاب */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold mb-1">حصاد الكُتّاب</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats?.total_ahzab}</h3>
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded mt-2 inline-block">حزب محفوظ كلياً</span>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <Layers size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. المصحف (للمراجعة والتحضير) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            📖 المصحف الشريف 
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">للمراجعة والتحضير</span>
          </h3>
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white min-h-[600px]">
             {/* استخدام المكون الصحيح */}
             <MushafView /> 
          </div>
        </div>

        {/* 3. سجل النشاطات الحية (Live Feed) */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <Clock size={20} className="text-emerald-600" />
            نشاط الحلقة المباشر
          </h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {feed.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:mr-3.5 before:-ml-px before:h-full before:w-0.5 before:bg-gray-100">
                {feed.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* الأيقونة */}
                    <div className={`absolute -right-1 rounded-full p-1 border-2 border-white ${item.type === 'badge' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {item.type === 'badge' ? <Award size={14} /> : <CheckCircle2 size={14} />}
                    </div>
                    
                    {/* المحتوى */}
                    <div className="mr-6 w-full">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{getTimeAgo(item.timestamp)}</p>
                      <p className="text-sm font-bold text-gray-800">{item.student_name}</p>
                      <p className={`text-sm text-gray-600 leading-snug mt-1 p-2 rounded-lg border ${item.type === 'badge' ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm flex flex-col items-center gap-2">
                <Activity size={30} className="opacity-20" />
                <span>لا يوجد نشاط حديث في الحلقة</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}