import { useState, useEffect, useMemo } from 'react';
import { Mic, History, Star, CheckCircle2, Clock, AlertCircle, Trash2, PlayCircle, User } from 'lucide-react';
import axios from 'axios';
import AudioRecorder from '../components/AudioRecorder';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

interface Chapter {
  id: number;
  name_arabic: string;
  verses_count: number;
}
interface Submission {
  id: number;
  surah_name: string;
  from_ayah: number;
  to_ayah: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  instructor_rating?: number;
  instructor_notes?: string;
  instructor_audio?: string; 
  audio_file: string;       
  created_at: string;
}

export default function RecitationsPage() {

  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]); 
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // حالات التفاعل
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // بيانات نموذج التسجيل
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [fromAyah, setFromAyah] = useState<number>(1);
  const [toAyah, setToAyah] = useState<number>(7);
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // --- التأثيرات (Effects) ---
  useEffect(() => {
    // 1. جلب قائمة السور
    axios.get('https://api.quran.com/api/v4/chapters?language=ar')
      .then(res => setChapters(res.data.chapters))
      .catch(err => console.error("فشل جلب السور:", err));

    // 2. جلب السجل
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await apiClient.get('/reviews/my-submissions/');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // --- المنطق (Logic) ---

  const currentSurahVerseCount = useMemo(() => {
    const surah = chapters.find(c => c.id === selectedSurahId);
    return surah ? surah.verses_count : 7;
  }, [selectedSurahId, chapters]);

  const handleSurahChange = (id: number) => {
    setSelectedSurahId(id);
    setFromAyah(1);
    const surah = chapters.find(c => c.id === id);
    const max = surah ? surah.verses_count : 7;
    setToAyah(max > 10 ? 10 : max); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);
    try {
      const selectedSurah = chapters.find(c => c.id === selectedSurahId);
      
      const data = new FormData();
      data.append('surah_name', selectedSurah?.name_arabic || 'غير محدد');
      data.append('from_ayah', fromAyah.toString());
      data.append('to_ayah', toAyah.toString());
      if (audioFile) {
      data.append('audio_file', audioFile); 
      }

      await apiClient.post('/reviews/submit-recitation/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNotification({ msg: "تم إرسال تلاوتك بنجاح! 🎉", type: 'success' });
      setAudioFile(null);
      setActiveTab('history');
      fetchHistory();
    } catch (err) {
      console.error(err);
      setNotification({ msg: "حدث خطأ أثناء الرفع، حاول مرة أخرى", type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const initiateDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await apiClient.delete(`/reviews/delete-submission/${deleteId}/`);
      setSubmissions(prev => prev.filter(sub => sub.id !== deleteId));
      setNotification({ msg: "تم حذف التلاوة بنجاح", type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ msg: "فشل الحذف، حاول مرة أخرى", type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  // --- الواجهة ---
  return (
    <Layout title="تلاواتي">
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        
        {/* التبويبات */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'new' 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Mic size={18} />
            تسجيل تلاوة
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'history' 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <History size={18} />
            سجل التلاوات
          </button>
        </div>

        {/* === تبويب: تسجيل جديد === */}
        {activeTab === 'new' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              بيانات التلاوة
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">السورة</label>
                <select
                  value={selectedSurahId}
                  onChange={(e) => handleSurahChange(Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-right"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.id}. سورة {ch.name_arabic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">من الآية</label>
                  <select
                    value={fromAyah}
                    onChange={(e) => setFromAyah(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-right"
                  >
                    {Array.from({ length: currentSurahVerseCount }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">إلى الآية</label>
                  <select
                    value={toAyah}
                    onChange={(e) => setToAyah(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-right"
                  >
                    {Array.from({ length: currentSurahVerseCount }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50">
                   <label className="block text-sm font-bold text-gray-700 mb-4 text-center">المسجل الصوتي</label>
                   <AudioRecorder onRecordingComplete={setAudioFile} />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !audioFile}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 mt-4"
              >
                {uploading ? 'جاري الرفع...' : 'إرسال للمشرف'}
              </button>
            </form>
          </div>
        )}

        {/* === تبويب: السجل === */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            {submissions.length === 0 && !loadingHistory ? (
              <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="text-gray-300" size={32} />
                </div>
                <h3 className="text-gray-800 font-bold mb-1">لا توجد تلاوات سابقة</h3>
                <p className="text-gray-500 text-sm mb-4">ابدأ رحلتك وسجل تلاوتك الأولى الآن</p>
                <button onClick={() => setActiveTab('new')} className="text-emerald-600 font-bold hover:underline">
                  تسجيل تلاوة جديدة
                </button>
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  {/* رأس البطاقة */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Mic size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{sub.surah_name}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">الآيات {sub.from_ayah} - {sub.to_ayah}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <StatusBadge status={sub.status} />
                       <button 
                         onClick={() => initiateDelete(sub.id)}
                         className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                         title="حذف التلاوة"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>

                  {/* مشغل صوت الطالب */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3 border border-gray-200">
                    <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm">
                      <PlayCircle size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-500 mb-1">تلاوتك المسجلة</p>
                      <audio controls src={sub.audio_file} className="w-full h-8" />
                    </div>
                  </div>

                  {/* منطقة ملاحظات المشرف - التعديل هنا: تظهر للمكتمل والمرفوض */}
                  {(sub.status === 'completed' || sub.status === 'rejected') && (
                    <div className={`p-4 rounded-xl relative overflow-hidden mt-4 border ${
                        sub.status === 'completed' 
                        ? 'bg-emerald-50/50 border-emerald-100' 
                        : 'bg-red-50/50 border-red-100' 
                    }`}>
                      <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${
                          sub.status === 'completed' ? 'border-emerald-100' : 'border-red-100'
                      }`}>
                        <div className={`p-1 rounded-full ${
                            sub.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <User size={14} />
                        </div>
                        <span className={`text-xs font-bold ${
                            sub.status === 'completed' ? 'text-emerald-800' : 'text-red-800'
                        }`}>تصحيح الشيخ</span>
                        
                        <div className="flex text-amber-400 mr-auto">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < (sub.instructor_rating || 0) ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>

                      {/* الملاحظات النصية */}
                      {sub.instructor_notes ? (
                        <p className="text-sm text-gray-700 leading-relaxed mb-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          "{sub.instructor_notes}"
                        </p>
                      ) : (
                        // رسالة في حالة عدم وجود ملاحظات
                        <p className="text-xs text-gray-400 italic mb-3">لا توجد ملاحظات مكتوبة</p>
                      )}

                      {/* الملاحظات الصوتية (للمشرف) */}
                      {sub.instructor_audio && (
                        <div className="bg-white rounded-lg p-2 border border-gray-100 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-600 px-2">رد صوتي:</span>
                          <audio controls src={sub.instructor_audio} className="w-full h-8" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400">
                    {/* تم حذف رقم الطلب بناءً على طلبك */}
                    <span>{new Date(sub.created_at).toLocaleDateString('ar-MA')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- نوافذ التفاعل --- */}
      {notification && (
        <Toast 
          message={notification.msg} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف التلاوة"
        message="هل أنت متأكد أنك تريد حذف هذه التلاوة؟ سيتم حذف التسجيل والملاحظات المرتبطة به نهائياً."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
        confirmText="نعم، احذف"
      />

    </Layout>
  );
}

// مكون حالة الطلب (Badge)
function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock, label: 'قيد الانتظار' },
    in_progress: { bg: 'bg-blue-50', text: 'text-blue-600', icon: Clock, label: 'جاري الاستماع' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2, label: 'تم التصحيح' },
    rejected: { bg: 'bg-red-50', text: 'text-red-600', icon: AlertCircle, label: 'إعادة مطلوبة' },
  };
  
  const { bg, text, icon: Icon, label } = config[status as keyof typeof config] || config.pending;

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-transparent ${bg} ${text}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}