import Modal from 'react-modal';
import Confetti from 'react-confetti';
import { Trophy, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

Modal.setAppElement('#root');

export interface NewBadge {
  name: string;
  description: string;
  icon_name: string;
}

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  newBadges: NewBadge[];
}

export default function CelebrationModal({ isOpen, onRequestClose, newBadges }: Props) {

  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  if (newBadges.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="تهانينا!"
      overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]" // Z-index عالي جداً
      className="bg-white w-full max-w-md mx-4 rounded-3xl shadow-2xl p-0 outline-none overflow-hidden relative animate-bounce-in"
    >
      {/* 1. تأثير القصاصات الملونة */}
      {isOpen && (
        <div className="absolute inset-0 pointer-events-none z-0">
           <Confetti 
             width={windowDimension.width} 
             height={windowDimension.height} 
             numberOfPieces={200} 
             recycle={false}
           />
        </div>
      )}

      <div className="relative z-10 text-center" dir="rtl">
        
        {/* رأس ملون */}
        <div className="bg-gradient-to-b from-yellow-400 to-orange-500 p-8 pb-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg mb-2 relative z-10">
             <Trophy size={48} className="text-yellow-500 fill-yellow-500 animate-pulse" />
           </div>
           <h2 className="text-3xl font-black text-white drop-shadow-md mt-4">مبارك لك!</h2>
           <p className="text-yellow-100 font-medium">إنجاز جديد يضاف لرصيدك</p>
           
           <button 
             onClick={onRequestClose}
             className="absolute top-4 left-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1 transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* قائمة الأوسمة المكتسبة */}
        <div className="p-6 -mt-6">
          <div className="space-y-4">
            {newBadges.map((badge, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 transform transition-all hover:scale-105">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-emerald-600">
                   <Star size={24} fill="currentColor" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-gray-800 text-lg">{badge.name}</h3>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onRequestClose}
            className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-95"
          >
            متابعة التقدم
          </button>
        </div>

      </div>
    </Modal>
  );
}