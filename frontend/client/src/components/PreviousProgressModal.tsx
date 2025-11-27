import { useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/apiClient';
import { CheckCircle2 } from 'lucide-react';

Modal.setAppElement('#root');

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onSuccess: () => void;
}

// قائمة الإنجازات النوعية التي يمكن اختيارها (يجب أن تطابق Backend)
const SPECIAL_ACHIEVEMENTS = [
  { id: 'juz_amma', label: 'جزء عم كاملاً' },
  { id: 'juz_tabarak', label: 'جزء تبارك كاملاً' },
  { id: 'surah_baqarah', label: 'سورة البقرة' },
  { id: 'surah_kahf', label: 'سورة الكهف' },
  { id: 'surah_yasin', label: 'سورة يس' },
  { id: 'surah_mulk', label: 'سورة الملك' },
  { id: 'surah_rahman', label: 'سورة الرحمن' },
];

export default function PreviousProgressModal({ isOpen, onRequestClose, onSuccess }: Props) {
  const [hizbCount, setHizbCount] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]); // حالة لتخزين الاختيارات
  const [loading, setLoading] = useState(false);

  // دالة للتحكم في الاختيار (تحديد/إلغاء تحديد)
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
        hizb_count: hizbCount,
        specific_badges: selectedBadges // إرسال القائمة المختارة
      });
      
      onSuccess();
      onRequestClose();
      
      // إعادة تعيين النموذج
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
        {/* رأس النافذة */}
        <div className="bg-emerald-700 p-5 text-white shrink-0">
          <h2 className="text-xl font-bold">تسجيل الحفظ السابق</h2>
          <p className="text-emerald-100 text-sm">سجل ما تحفظه مسبقاً لنحسب مستواك وأوسمتك</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* 1. الكمية (الأحزاب) */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              كم حزباً تحفظه بشكل متقن؟ (العدد الإجمالي)
            </label>
            <input 
              type="number" 
              min="0" max="60" 
              placeholder="مثال: 5"
              value={hizbCount}
              onChange={(e) => setHizbCount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* 2. النوعية (السور والأجزاء) */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              هل أتممت حفظ أي من هذه السور/الأجزاء؟
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SPECIAL_ACHIEVEMENTS.map((item) => {
                const isSelected = selectedBadges.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleBadge(item.id)}
                    className={`
                      cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between
                      ${isSelected 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}
                    `}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {isSelected && <CheckCircle2 size={18} className="text-emerald-600" />}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* الأزرار */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? 'جاري المعالجة...' : 'حفظ وتحديث مستواي'}
            </button>
            <button 
              type="button"
              onClick={onRequestClose}
              className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}