import { useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/apiClient';

Modal.setAppElement('#root');

interface LogWirdModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onLogCreated: () => void;
}

export default function LogWirdModal({ isOpen, onRequestClose, onLogCreated }: LogWirdModalProps) {
  const [logType, setLogType] = useState('memorization');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await apiClient.post('/progress-logs/', {
        log_type: logType,
        quantity_description: quantity,
        self_notes: notes,
      });

      onLogCreated();
      onRequestClose();
      setQuantity('');
      setNotes('');
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حفظ الوِرد.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="تسجيل الوِرد اليومي"
      // 1. تنسيق الخلفية المعتمة (Overlay)
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      // 2. تنسيق صندوق النافذة (Content)
      className="bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl p-0 outline-none overflow-hidden transform transition-all"
    >
      <div dir="rtl">
        {/* رأس النافذة */}
        <div className="bg-emerald-600 p-6">
          <h2 className="text-2xl font-bold text-white">تسجيل الوِرد اليومي</h2>
          <p className="text-emerald-100 text-sm mt-1">وثّق إنجازك وواصل تقدمك</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* اختيار النوع */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع التسجيل</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLogType('memorization')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    logType === 'memorization'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📖 حفظ جديد
                </button>
                <button
                  type="button"
                  onClick={() => setLogType('review')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    logType === 'review'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🔄 مراجعة
                </button>
              </div>
            </div>
            
            {/* الكمية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المنجزة</label>
              <input
                type="text"
                placeholder="مثال: سورة البقرة من آية 1 إلى 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>
            
            {/* الملاحظات */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظاتك (اختياري)</label>
              <textarea
                rows={3}
                placeholder="هل واجهت صعوبة؟ هل تحتاج مراجعة التجويد؟"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
            </div>
            
            {/* الأزرار */}
            <div className="flex gap-3 mt-6 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors"
              >
                حفظ
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