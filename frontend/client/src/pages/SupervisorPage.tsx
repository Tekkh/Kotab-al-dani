import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Clock, ChevronLeft, User, Loader2, CheckCircle2, Archive, AlertTriangle, Edit } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';

interface ReviewItem {
  id: number;
  student_name: string;
  surah_name: string;
  from_ayah: number;
  to_ayah: number;
  created_at: string;
  updated_at?: string; // وقت التصحيح للأرشيف
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
}

export default function SupervisorPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'archive'>('pending');
  
  const [pendingReviews, setPendingReviews] = useState<ReviewItem[]>([]);
  const [archiveReviews, setArchiveReviews] = useState<ReviewItem[]>([]);
  
  const [loading, setLoading] = useState(true);

  // جلب البيانات بناءً على التبويب النشط
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'pending') {
          const res = await apiClient.get('/reviews/pending-reviews/');
          setPendingReviews(res.data);
        } else {
          const res = await apiClient.get('/reviews/supervisor-archive/');
          setArchiveReviews(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // دوال مساعدة للوقت
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'منذ لحظات';
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `منذ ${minutes} د`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} س`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  const isLate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return hours >= 24;
  };

  return (
    <Layout title="لوحة الإشراف">
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        
        {/* التبويبات */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'pending' 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={18} />
            مهام تنتظر التصحيح
            {pendingReviews.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {pendingReviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'archive' 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Archive size={18} />
            أرشيف الأسبوع
          </button>
        </div>

        {/* تنبيه الأرشيف */}
        {activeTab === 'archive' && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-amber-800">سياسة الأرشيف</p>
              <p className="text-xs text-amber-700 mt-1">
                يتم الاحتفاظ بالتلاوات المصححة هنا لمدة 7 أيام فقط للمراجعة، ثم تختفي تلقائياً من لوحتك.
              </p>
            </div>
          </div>
        )}

        {/* المحتوى */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : (
          <>
            {/* عرض القائمة الحالية (سواء معلقة أو أرشيف) */}
            {(activeTab === 'pending' ? pendingReviews : archiveReviews).length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center animate-fade-in">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${activeTab === 'pending' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'}`}>
                  {activeTab === 'pending' ? <CheckCircle2 size={40} /> : <Archive size={40} />}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {activeTab === 'pending' ? 'أحسنت! لا توجد مهام معلقة' : 'الأرشيف فارغ'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === 'pending' ? 'لقد قمت بإنجاز جميع المهام المطلوبة.' : 'لم تقم بتصحيح أي تلاوة خلال الأيام السبعة الماضية.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === 'pending' ? pendingReviews : archiveReviews).map((review) => (
                  <div 
                    key={review.id} 
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group animate-scale-in"
                  >
                    {/* رأس البطاقة */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                          <User size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{review.student_name}</h4>
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${
                            activeTab === 'pending' && isLate(review.created_at) ? 'text-red-500' : 'text-gray-400'
                          }`}>
                            <Clock size={10} />
                            {/* في الأرشيف نعرض متى تم التصحيح، في المعلق نعرض متى تم الإنشاء */}
                            {activeTab === 'archive' 
                              ? `صُححت ${getTimeAgo(review.updated_at || review.created_at)}`
                              : getTimeAgo(review.created_at)
                            }
                          </span>
                        </div>
                      </div>
                      
                      {/* حالة البطاقة في الأرشيف */}
                      {activeTab === 'archive' && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          review.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {review.status === 'completed' ? 'مقبول' : 'مرفوض'}
                        </span>
                      )}

                      {/* نقطة التنبيه في المعلق */}
                      {activeTab === 'pending' && isLate(review.created_at) && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="متأخر"></span>
                      )}
                    </div>

                    {/* تفاصيل التلاوة */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Mic size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700">سورة {review.surah_name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mr-6">
                        الآيات {review.from_ayah} - {review.to_ayah}
                      </p>
                    </div>

                    {/* زر الإجراء (يختلف حسب التبويب) */}
                    <button
                      onClick={() => navigate(`/supervisor/review/${review.id}`)}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm ${
                        activeTab === 'pending'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                      }`}
                    >
                      {activeTab === 'pending' ? (
                        <>
                          <span>بدء التصحيح</span>
                          <ChevronLeft size={16} />
                        </>
                      ) : (
                        <>
                          <Edit size={16} />
                          <span>مراجعة / تعديل</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}