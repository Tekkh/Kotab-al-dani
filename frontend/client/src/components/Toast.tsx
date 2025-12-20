import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    // إخفاء تلقائي بعد 3 ثواني
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-500 text-white',
  };

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full shadow-xl shadow-gray-200/50 animate-fade-in-up transition-all ${styles[type]}`}>
      <Icon size={20} />
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 mr-2">
        <X size={16} />
      </button>
    </div>
  );
}