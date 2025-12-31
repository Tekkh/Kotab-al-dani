import { useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/apiClient';

Modal.setAppElement('#root');

interface LogWirdModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onLogCreated: () => void;
  onBadgesEarned?: (badges: any[]) => void;
}

export default function LogWirdModal({ isOpen, onRequestClose, onLogCreated, onBadgesEarned }: LogWirdModalProps) {
  const [logType, setLogType] = useState('memorization');
  
  const [juz, setJuz] = useState(1);
  const [hizb, setHizb] = useState(1);
  const [thumn, setThumn] = useState(1);
  
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getHizbsForJuz = (juzNum: number) => {
    const startHizb = (juzNum - 1) * 2 + 1;
    return [startHizb, startHizb + 1];
  };

  const handleJuzChange = (newJuz: number) => {
    setJuz(newJuz);
    const availableHizbs = getHizbsForJuz(newJuz);
    setHizb(availableHizbs[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const quantityDesc = `الحزب ${hizb} - الثمن ${thumn} (الجزء ${juz})`;

      // 1. تسجيل السجل التاريخي
      await apiClient.post('/progress-logs/', {
        log_type: logType,
        quantity_description: quantityDesc,
        self_notes: notes,
      });

      // 2. تسجيل الثمن (والحصول على الأوسمة)
      if (logType === 'memorization') {
        try {
          const response = await apiClient.post('/thumn-progress/', {
            juz, hizb, thumn, status: 'memorized'
          });

          if (response.data.new_earned_badges && response.data.new_earned_badges.length > 0) {
            if (onBadgesEarned) {
               onBadgesEarned(response.data.new_earned_badges);
            }
          }

        } catch (ignoreErr) {
          console.log("Thumn update skipped", ignoreErr);
        }
      }

      onLogCreated();
      onRequestClose();
      setNotes('');
      
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حفظ الثمن.");
    } finally {
      setLoading(false);
    }
  };

  const currentHizbs = getHizbsForJuz(juz);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="تسجيل الثمن"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      className="bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl p-0 outline-none overflow-hidden transform transition-all"
    >
      <div dir="rtl">
        <div className="bg-emerald-600 p-6">
          <h2 className="text-2xl font-bold text-white">تسجيل ثمن جديد</h2>
          <p className="text-emerald-100 text-sm mt-1">وثّق تقدمك بالأثمان</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع الإنجاز</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLogType('memorization')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    logType === 'memorization' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📖 حفظ جديد
                </button>
                <button
                  type="button"
                  onClick={() => setLogType('review')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    logType === 'review' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🔄 مراجعة
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الجزء</label>
                <select 
                  value={juz} onChange={(e) => handleJuzChange(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الحزب</label>
                <select 
                  value={hizb} onChange={(e) => setHizb(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {currentHizbs.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الثمن</label>
                <select 
                  value={thumn} onChange={(e) => setThumn(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>
            
            <div className="flex gap-3 mt-6 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-70"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                type="button"
                onClick={onRequestClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}