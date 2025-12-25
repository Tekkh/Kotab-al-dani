import { AlertTriangle} from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel, 
  confirmText = "نعم، تأكيد", 
  cancelText = "إلغاء",
  isDanger = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        
        {/* المحتوى */}
        <div className="p-6 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
        </div>

        {/* الأزرار */}
        <div className="flex border-t border-gray-100 bg-gray-50/50 p-4 gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-sm"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white font-bold shadow-sm hover:shadow-md transition-all text-sm ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}