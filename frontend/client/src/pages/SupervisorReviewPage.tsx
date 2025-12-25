import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, User, BookOpen, Clock,
  Mic, Save, AlertCircle, CheckCircle2 
} from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';
import AudioRecorder from '../components/AudioRecorder'; 
import Toast from '../components/Toast';

interface ReviewData {
  id: number;
  student_name: string;
  surah_name: string;
  from_ayah: number;
  to_ayah: number;
  audio_file: string;
  created_at: string;
  instructor_audio?: string;
  instructor_notes?: string;
  instructor_rating?: number;
}

export default function SupervisorReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [instructorAudio, setInstructorAudio] = useState<File | null>(null);
  const [status, setStatus] = useState<'completed' | 'rejected'>('completed'); 
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/reviews/submit-feedback/${id}/`);
        setData(res.data);
        // تعبئة البيانات إذا كانت موجودة مسبقاً (في حالة التعديل)
        if (res.data.instructor_notes) setNotes(res.data.instructor_notes);
        if (res.data.instructor_rating) setRating(res.data.instructor_rating);
      } catch (err) {
        console.error(err);
        setToast({ msg: "فشل تحميل التلاوة", type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('instructor_rating', rating.toString());
      formData.append('instructor_notes', notes);
      if (instructorAudio) {
        formData.append('instructor_audio', instructorAudio);
      }

      await apiClient.patch(`/reviews/submit-feedback/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ msg: "تم إرسال التصحيح بنجاح! ✅", type: 'success' });
      
      setTimeout(() => navigate('/supervisor'), 1500);
      
    } catch (err) {
      console.error(err);
      setToast({ msg: "حدث خطأ أثناء الحفظ", type: 'error' });
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><div className="p-10 text-center">جاري تحميل التلاوة...</div></Layout>;
  if (!data) return <Layout><div className="p-10 text-center text-red-500">التلاوة غير موجودة</div></Layout>;

  return (
    <Layout title="تصحيح التلاوة">
      <div className="max-w-3xl mx-auto space-y-6 pb-24">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors w-fit"
        >
          <ArrowRight size={20} />
          <span>عودة للمهام</span>
        </button>

        {/* 1. بطاقة الطالب والتلاوة */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100">
                <User size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{data.student_name}</h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Clock size={14} />
                  <span>{new Date(data.created_at).toLocaleString('ar-MA')}</span>
                </div>
              </div>
            </div>
            
            <div className="text-left bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                <BookOpen size={16} />
                <span>سورة {data.surah_name}</span>
              </div>
              <p className="text-xs text-gray-500">الآيات {data.from_ayah} - {data.to_ayah}</p>
            </div>
          </div>

          {/* مشغل التلاوة (Hero Section) */}
          <div className="mt-8 bg-gray-900 rounded-2xl p-6 text-white flex flex-col items-center shadow-lg shadow-gray-200">
            <div className="mb-4 text-gray-400 text-sm font-bold">استمع لتلاوة الطالب</div>
            <audio controls src={data.audio_file} className="w-full h-12" />
          </div>
        </div>

        {/* 2. أدوات التصحيح (Form) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 animate-fade-in-up">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Mic className="text-emerald-600" />
            تقييمك وملاحظاتك
          </h3>

          {/* أ) تسجيل رد صوتي */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">تسجيل رد صوتي (تصحيح اللحن)</label>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <AudioRecorder onRecordingComplete={setInstructorAudio} />
              {data.instructor_audio && !instructorAudio && (
                <div className="mt-2 text-xs text-gray-500">يوجد تسجيل سابق محفوظ</div>
              )}
            </div>
          </div>

          {/* ب) التقييم والملاحظات */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">التقييم (من 5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">القرار النهائي</label>
               <div className="flex bg-gray-100 p-1 rounded-xl">
                 <button
                   onClick={() => setStatus('completed')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${status === 'completed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}
                 >
                   <CheckCircle2 size={16} />
                   اعتماد الحفظ
                 </button>
                 <button
                   onClick={() => setStatus('rejected')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${status === 'rejected' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                 >
                   <AlertCircle size={16} />
                   طلب إعادة
                 </button>
               </div>
            </div>
          </div>

          {/* ج) ملاحظات نصية */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات إضافية (اختياري)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب ملاحظاتك للطالب هنا..."
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none h-32 resize-none"
            />
          </div>

          {/* زر الحفظ */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
              status === 'completed' 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting ? 'جاري الحفظ...' : (
              <>
                <Save size={20} />
                <span>{status === 'completed' ? 'إرسال التقييم واعتماد الحفظ' : 'إرسال طلب الإعادة'}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
}