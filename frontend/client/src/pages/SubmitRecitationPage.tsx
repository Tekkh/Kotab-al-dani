import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, AlertCircle } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';
import apiClient from '../api/apiClient';

export default function SubmitRecitationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    surah_name: '',
    from_ayah: '',
    to_ayah: '',
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!audioFile) {
      setError("الرجاء تسجيل التلاوة أولاً");
      return;
    }

    setLoading(true);

    try {
 
      const data = new FormData();
      data.append('surah_name', formData.surah_name);
      data.append('from_ayah', formData.from_ayah);
      data.append('to_ayah', formData.to_ayah);
      data.append('audio_file', audioFile); 

      await apiClient.post('/reviews/submit-recitation/', data, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      alert("تم إرسال التلاوة للمشرف بنجاح! 🎉");
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الإرسال، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24">
      {/* رأس الصفحة */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <ArrowRight size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">تسميع جديد</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. بيانات التلاوة */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">اسم السورة</label>
            <input
              type="text"
              required
              placeholder="مثال: البقرة"
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              value={formData.surah_name}
              onChange={e => setFormData({...formData, surah_name: e.target.value})}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">من الآية</label>
              <input
                type="number"
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                value={formData.from_ayah}
                onChange={e => setFormData({...formData, from_ayah: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">إلى الآية</label>
              <input
                type="number"
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                value={formData.to_ayah}
                onChange={e => setFormData({...formData, to_ayah: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* 2. مسجل الصوت */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 mr-1">تسجيل التلاوة</label>
          <AudioRecorder onRecordingComplete={setAudioFile} />
        </div>

        {/* رسائل الخطأ */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={loading || !audioFile}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span>جاري الرفع...</span>
          ) : (
            <>
              <span>إرسال للمشرف</span>
              <Send size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}