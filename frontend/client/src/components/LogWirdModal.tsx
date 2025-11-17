import { useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/apiClient';

// --- إعدادات Modal (للوصولية) ---
// نخبر الـ Modal أن يتجاهل العنصر الجذري (root)
Modal.setAppElement('#root');

// --- 1. تعريف "الخصائص" (Props) التي سيتلقاها المكون ---
interface LogWirdModalProps {
  isOpen: boolean; // هل النافذة مفتوحة؟
  onRequestClose: () => void; // دالة لإغلاق النافذة
  onLogCreated: () => void; // دالة لتحديث القائمة (سنستخدمها لاحقاً)
}

export default function LogWirdModal({ isOpen, onRequestClose, onLogCreated }: LogWirdModalProps) {
  // --- 2. "حالات" (States) للنموذج الداخلي ---
  const [logType, setLogType] = useState('memorization'); // (حفظ جديد / مراجعة)
  const [quantity, setQuantity] = useState(''); // (الكمية كنص)
  const [notes, setNotes] = useState(''); // (ملاحظات ذاتية)
  const [error, setError] = useState<string | null>(null);

  // --- 3. دالة إرسال النموذج ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 4. إرسال البيانات إلى الـ API المحمي (سيتم إضافة التوكن تلقائياً)
      await apiClient.post('/progress-logs/', {
        log_type: logType,
        quantity_description: quantity,
        self_notes: notes,
      });

      // 5. إذا نجح
      onLogCreated(); // (أخبر الصفحة الرئيسية بتحديث البيانات)
      onRequestClose(); // (أغلق النافذة)
      // (إعادة تعيين النموذج للمرة القادمة)
      setQuantity('');
      setNotes('');

    } catch (err) {
      console.error("فشل إنشاء السجل:", err);
      setError("حدث خطأ أثناء حفظ الوِرد.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="تسجيل الوِرد اليومي"
      // (يمكن إضافة تنسيقات CSS لاحقاً)
    >
      <h2>تسجيل الوِرد اليومي</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>نوع التسجيل:</label>
          <select value={logType} onChange={(e) => setLogType(e.target.value)}>
            <option value="memorization">حفظ جديد</option>
            <option value="review">مراجعة</option>
          </select>
        </div>

        <div>
          <label>الكمية (مثال: البقرة 1-5):</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div>
          <label>ملاحظات ذاتية (اختياري):</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <hr />
        <button type="submit">حفظ الوِرد</button>
        <button type="button" onClick={onRequestClose}>إلغاء</button>
      </form>
    </Modal>
  );
}