import Modal from 'react-modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

Modal.setAppElement('#root');

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({ isOpen, onRequestClose, onConfirm, loading }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="تأكيد الحذف"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      className="bg-white w-full max-w-sm mx-4 rounded-2xl shadow-2xl p-0 outline-none overflow-hidden transform transition-all"
    >
      <div dir="rtl" className="p-6 text-center">
        
        {/* أيقونة التحذير */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">هل أنت متأكد؟</h2>
        <p className="text-gray-500 text-sm mb-6">
          سيتم حذف هذا السجل نهائياً. لا يمكن التراجع عن هذا الإجراء.
        </p>

        {/* الأزرار */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 w-full"
          >
            {loading ? 'جاري الحذف...' : (
              <>
                <Trash2 size={18} />
                نعم، احذف
              </>
            )}
          </button>
          
          <button
            onClick={onRequestClose}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors w-full"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}