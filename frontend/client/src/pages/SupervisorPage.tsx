import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Clock, ChevronLeft, User, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';

interface PendingReview {
  id: number;
  student_name: string;
  surah_name: string;
  from_ayah: number;
  to_ayah: number;
  created_at: string;
  status: 'pending' | 'in_progress';
}

export default function SupervisorPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const res = await apiClient.get('/reviews/pending-reviews/');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // دالة مساعدة لحساب الوقت المنقضي
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'منذ لحظات';
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  // تحديد لون الوقت (أحمر إذا تأخر أكثر من 24 ساعة)
  const isLate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return hours >= 24;
  };

  return (
    <Layout title="مهام الإشراف">
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" />
              تلاوات بانتظار التصحيح
            </h2>
            <p className="text-sm text-gray-500 mt-1">لديك {reviews.length} مهام معلقة اليوم</p>
          </div>
        </div>

        {/* المحتوى */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : reviews.length === 0 ? (
          // حالة عدم وجود مهام (Empty State)
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">أحسنت! لا توجد مهام معلقة</h3>
            <p className="text-gray-500">لقد قمت بتصحيح جميع التلاوات المرسلة.</p>
          </div>
        ) : (
          // شبكة البطاقات
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group animate-scale-in"
              >
                {/* الجزء العلوي: الطالب والوقت */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{review.student_name || 'طالب مجتهد'}</h4>
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${isLate(review.created_at) ? 'text-red-500' : 'text-gray-400'}`}>
                        <Clock size={10} />
                        {getTimeAgo(review.created_at)}
                      </span>
                    </div>
                  </div>
                  {/* حالة الاستعجال */}
                  {isLate(review.created_at) && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="متأخر"></span>
                  )}
                </div>

                {/* تفاصيل المهمة */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Mic size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-gray-700">سورة {review.surah_name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mr-6">
                    من الآية {review.from_ayah} إلى الآية {review.to_ayah}
                  </p>
                </div>

                {/* زر الإجراء */}
                <button
                  onClick={() => navigate(`/supervisor/review/${review.id}`)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-100"
                >
                  <span>بدء التصحيح</span>
                  <ChevronLeft size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}