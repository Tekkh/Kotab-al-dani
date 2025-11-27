import { useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/apiClient';
import { CheckCircle2, Info } from 'lucide-react'; // استيراد أيقونة معلومات

Modal.setAppElement('#root');

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onSuccess: () => void;
}

const SPECIAL_ACHIEVEMENTS = [
  { id: 'juz_amma', label: 'جزء عم كاملاً', value: '+16 ثمن' },
  { id: 'juz_tabarak', label: 'جزء تبارك كاملاً', value: '+16 ثمن' },
  { id: 'surah_baqarah', label: 'سورة البقرة', value: '+40 ثمن' },
  { id: 'surah_kahf', label: 'سورة الكهف', value: '+8 أثمان' },
  { id: 'surah_yasin', label: 'سورة يس', value: '+4 أثمان' },
  { id: 'surah_mulk', label: 'سورة الملك', value: '+2 ثمن' },
  { id: 'surah_rahman', label: 'سورة الرحمن', value: '+2 ثمن' },
];

export default function PreviousProgressModal({ isOpen, onRequestClose, onSuccess }: Props) {
  const [hizbCount, setHizbCount] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleBadge = (id: string) => {
    setSelectedBadges(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/set-previous-progress/', {
        hizb_count: hizbCount, // سيرسله حتى لو كان فارغاً (سيعالج كـ 0 في الخلفية)
        specific_badges: selectedBadges
      });
      
      onSuccess();
      onRequestClose();
      setHizbCount('');
      setSelectedBadges([]);
      
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="تسجيل الحفظ السابق"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      className="bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl p-0 outline-none overflow-hidden max-h-[90vh] flex flex-col"
    >
      <div dir="rtl" className="flex flex-col h-full">
        <div className="bg-emerald-700 p-5 text-white shrink-0">
          <h2 className="text-xl font-bold">تسجيل الحفظ السابق</h2>
          <p className="text-emerald-100 text-sm">سجل ما تحفظه مسبقاً لنحسب مستواك</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* 1. الاختيارات الذكية (السور) */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              اختر السور أو الأجزاء التي تحفظها:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPECIAL_ACHIEVEMENTS.map((item) => {
                const isSelected = selectedBadges.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleBadge(item.id)}
                    className={`
                      cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between
                      ${isSelected 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm ring-1 ring-emerald-500' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}
                    `}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{item.label}</span>
                      <span className="text-[10px] text-gray-400">{item.value}</span>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* 2. الإدخال اليدوي (اختياري) */}
          <div className="mb-6 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-start gap-2 mb-2">
              <Info size={16} className="text-emerald-600 mt-1 shrink-0" />
              <label className="block text-sm font-bold text-gray-700">
                هل لديك حفظ آخر (إضافي)؟
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-3 mr-6">
              أدخل هنا عدد الأحزاب الإضافية *غير الموجودة* في القائمة أعلاه.
            </p>
            <input 
              type="number" 
              min="0" max="60" 
              placeholder="عدد الأحزاب الإضافية (مثلاً: 2)"
              value={hizbCount}
              onChange={(e) => setHizbCount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? 'جاري المعالجة...' : 'حفظ وتحديث مستواي'}
            </button>
            <button 
              type="button"
              onClick={onRequestClose}
              className="px-5 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}