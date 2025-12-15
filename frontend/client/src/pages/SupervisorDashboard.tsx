import { useState, useEffect } from 'react';
import { 
  Users, Activity, Layers, Award, CheckCircle2, 
  Clock, BookOpen, X, TrendingUp, AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import apiClient from '../api/apiClient';
import MushafView from '../components/MusafView';

// --- واجهات البيانات ---
interface DashboardStats {
  total_students: number;
  active_today: number;
  total_ahzab: number;
}

interface ActivityItem {
  type: 'progress' | 'badge' | 'review';
  student_name: string;
  description: string;
  timestamp: string;
}

// بيانات تجريبية للمبيان (سنربطها بالباك إند لاحقاً)
const MOCK_CHART_DATA = [
  { name: 'السبت', pages: 4 },
  { name: 'الأحد', pages: 12 },
  { name: 'الاثنين', pages: 8 },
  { name: 'الثلاثاء', pages: 15 },
  { name: 'الأربعاء', pages: 10 },
  { name: 'الخميس', pages: 22 },
  { name: 'الجمعة', pages: 18 },
];

export default function SupervisorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feed, setFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMushafOpen, setIsMushafOpen] = useState(false);

  // --- دوال مساعدة لغوية ---

  // دالة التعامل مع قواعد العدد والمعدود العربية
  const getArabicPlural = (count: number, type: 'student' | 'hizb' | 'page') => {
    // 1. حالة الطلاب
    if (type === 'student') {
      if (count === 1) return 'طالب واحد';
      if (count === 2) return 'طالبين';
      if (count >= 3 && count <= 10) return `${count} طلاب`;
      return `${count} طالباً`;
    }
    
    // 2. حالة الأحزاب
    if (type === 'hizb') {
      if (count === 1) return 'حزب واحد';
      if (count === 2) return 'حزبين';
      if (count >= 3 && count <= 10) return `${count} أحزاب`;
      return `${count} حزباً`;
    }

    // 3. حالة الصفحات (للمبيان)
    if (type === 'page') {
      // القاعدة: من 3 إلى 10 (صفحات)، ما فوق 11 (صفحة)
      if (count <= 10) return `${count} صفحات`;
      return `${count} صفحة`;
    }
    
    return `${count}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'منذ لحظات';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} د`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} س`;
    return 'منذ يوم+';
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

  // تخصيص التلميح (Tooltip) في المبيان ليظهر بالعربية
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-center">
          <p className="text-gray-500 text-xs font-bold mb-1">{label}</p>
          <p className="text-emerald-600 font-bold text-lg">
            {getArabicPlural(payload[0].value, 'page')}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-emerald-600 font-bold animate-pulse">جاري تحميل البيانات...</div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. رأس الصفحة + زر المصحف */}
      <div className="flex items-center justify-between">
        <div>
          {/*<h2 className="text-2xl font-bold text-gray-800">نظرة شاملة على أداء الكُتّاب اليوم</h2>*/}
          <p className="text-gray-600 text-sm">نظرة شاملة على أداء الكُتّاب اليوم</p>
        </div>
        <button 
          onClick={() => setIsMushafOpen(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-gray-200"
        >
          <BookOpen size={18} />
          <span className="font-bold text-sm">فتح المصحف المرجعي</span>
        </button>
      </div>

      {/* 2. شريط العدادات (Stats Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="مجتمع الحفظة" 
          value={getArabicPlural(stats?.total_students || 0, 'student')}
          subLabel="مسجل في المنصة"
          icon={Users} 
          color="blue" 
        />
        <StatsCard 
          title="النشاط اليوم" 
          value={getArabicPlural(stats?.active_today || 0, 'student')}
          subLabel="سجل نشاطاً (24س)"
          icon={Activity} 
          color="orange" 
        />
        <StatsCard 
          title="حصاد الكُتّاب" 
          value={getArabicPlural(Math.floor(stats?.total_ahzab || 0), 'hizb')} 
          subLabel="تم حفظها كلياً"
          icon={Layers} 
          color="purple" 
        />
      </div>

      {/* 3. المنطقة الرئيسية (Chart + Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* اليمين (الثلثين): الرسم البياني التحليلي */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-emerald-600" size={20} />
              مؤشر الهمة (آخر 7 أيام)
            </h3>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">عدد الصفحات المحفوظة</span>
          </div>
          
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="pages" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPages)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* اليسار (الثلث): سجل النشاطات */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock className="text-emerald-600" size={18} />
              نبض الحلقة
            </h3>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {feed.length > 0 ? (
              <div className="space-y-5">
                {feed.map((item, index) => (
                  <div key={index} className="flex gap-3 relative">
                     {/* خط الزمن */}
                    {index !== feed.length - 1 && (
                      <div className="absolute top-8 right-[11px] w-[2px] h-full bg-gray-100"></div>
                    )}
                    
                    {/* الأيقونة */}
                    <div className={`relative z-10 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                      item.type === 'badge' ? 'bg-amber-100 text-amber-600' : 
                      item.type === 'review' ? 'bg-blue-100 text-blue-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.type === 'badge' ? <Award size={12} /> : <CheckCircle2 size={12} />}
                    </div>

                    {/* المحتوى */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-800">{item.student_name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{getTimeAgo(item.timestamp)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <AlertCircle size={32} className="opacity-20" />
                <p className="text-sm">لا توجد نشاطات حديثة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. نافذة المصحف المنبثقة (Modal) */}
      {isMushafOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            {/* رأس النافذة */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-emerald-600" size={20} />
                المصحف الشريف (وضع المراجعة)
              </h3>
              <button 
                onClick={() => setIsMushafOpen(false)}
                className="p-2 bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-gray-200 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar p-2">
              <MushafView />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// مكون مساعد لبطاقات الإحصائيات (معدل لاستقبال النص الكامل)
function StatsCard({ title, value, subLabel, icon: Icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-bold mb-2">{title}</p>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <span className="text-xs text-gray-400 font-medium mt-1">{subLabel}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}