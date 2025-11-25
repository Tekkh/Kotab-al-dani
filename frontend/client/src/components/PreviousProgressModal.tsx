import { useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/apiClient';

Modal.setAppElement('#root');

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onSuccess: () => void; // لتحديث البيانات في اللوحة الأم
}

export default function PreviousProgressModal({ isOpen, onRequestClose, onSuccess }: Props) {
  const [hizbCount, setHizbCount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/set-previous-progress/', {
        hizb_count: hizbCount
      });
      onSuccess(); // تحديث الواجهة
      onRequestClose();
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
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl p-0 outline-none overflow-hidden"
    >
      <div dir="rtl">
        <div className="bg-emerald-700 p-5 text-white">
          <h2 className="text-xl font-bold">تسجيل الحفظ السابق</h2>
          <p className="text-emerald-100 text-sm">هل تحفظ أجزاء من قبل؟ سجلها لنحسبها لك.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            كم حزباً تحفظه بشكل متقن؟
          </label>
          <input 
            type="number" 
            min="0" 
            max="60" 
            placeholder="مثال: 5"
            value={hizbCount}
            onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > 60) return; 
                setHizbCount(e.target.value)
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none mb-6"
            required
          />
          
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري الحساب...' : 'حفظ الرصيد'}
            </button>
            <button 
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}