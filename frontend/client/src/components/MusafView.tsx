import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Search, Loader2, BookOpen } from 'lucide-react';

// واجهة لبيانات السورة من API
interface Chapter {
  id: number;
  name_arabic: string;
  pages: [number, number]; // [صفحة البداية، صفحة النهاية]
}

export default function MusafView() {
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1); // رقم السورة المختارة

  // 1. جلب قائمة السور عند تحميل المكون
  useEffect(() => {
    axios.get('https://api.quran.com/api/v4/chapters?language=ar')
      .then(res => {
        setChapters(res.data.chapters);
      })
      .catch(err => console.error("فشل جلب قائمة السور", err));
  }, []);

  // 2. تحديث السورة بناءً على الصفحة الحالية
  useEffect(() => {
    if (chapters.length > 0) {
      // نجد السورة التي تحتوي هذه الصفحة
      const currentChapter = chapters.find(ch => page >= ch.pages[0] && page <= ch.pages[1]);
      if (currentChapter) {
        setSelectedSurah(currentChapter.id);
      }
    }
    
    setLoading(true);
    setImageError(false);
    setInputPage(page.toString());
  }, [page, chapters]);

  // 3. دالة توليد رابط الصورة (مصحف ورش - دار المعرفة)
  const getPageUrl = (pageNum: number) => {
    // تنسيق الرقم: 001, 050, 604
    const pageStr = pageNum.toString().padStart(3, '0');
    
    // --- [الخيار 1: أرشيف الإنترنت - مصحف ورش (نسخة المدينة)] ---
    // رابط مباشر ومجرب، عادة ما يكون مستقراً
    return `https://archive.org/download/Warsh-Madinah-Mushaf/Warsh-Madinah-Mushaf-${pageStr}.jpg`;

    // --- [الخيار 3: خادم صور بديل] ---
    // return `https://shamelws.com/download/quran/warsh/${pageStr}.jpg`;
  };

  // التنقل عند اختيار سورة من القائمة
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const surahId = Number(e.target.value);
    setSelectedSurah(surahId);
    
    const chapter = chapters.find(c => c.id === surahId);
    if (chapter) {
      setPage(chapter.pages[0]); // الانتقال لبداية السورة
    }
  };

  const handlePageInput = (e: React.FormEvent) => {
    e.preventDefault();
    let p = parseInt(inputPage);
    if (isNaN(p)) p = 1;
    if (p < 1) p = 1;
    if (p > 604) p = 604;
    setPage(p);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[850px]">
      
      {/* الشريط العلوي: أدوات التحكم */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* 1. قائمة السور (ميزة جديدة) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <BookOpen className="text-emerald-600 w-5 h-5" />
          <select 
            value={selectedSurah}
            onChange={handleSurahChange}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white flex-1 md:w-48"
          >
            <option value="" disabled>اختر السورة</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>
                {ch.id}. {ch.name_arabic}
              </option>
            ))}
          </select>
        </div>

        {/* 2. البحث بالصفحة */}
        <form onSubmit={handlePageInput} className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">صفحة:</span>
          <div className="relative">
            <input 
              type="number" min="1" max="604"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              className="w-16 p-1.5 pl-2 text-center border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </form>

        {/* 3. أزرار التنقل */}
        <div className="flex items-center gap-2" dir="ltr">
          <button 
            onClick={() => setPage(p => Math.min(604, p + 1))}
            disabled={page >= 604}
            className="p-2 bg-white border hover:bg-gray-100 rounded-full disabled:opacity-50 transition-colors shadow-sm"
            title="الصفحة التالية"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 bg-white border hover:bg-gray-100 rounded-full disabled:opacity-50 transition-colors shadow-sm"
            title="الصفحة السابقة"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* منطقة العرض */}
      <div className="flex-1 bg-[#fffdf5] flex justify-center items-center overflow-auto relative p-2 scroll-smooth">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fffdf5] z-10">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
            <span className="text-emerald-800 font-medium animate-pulse">جاري جلب الصفحة...</span>
          </div>
        )}

        {imageError ? (
          <div className="text-center text-red-500">
            <p>فشل تحميل الصورة.</p>
            <button onClick={() => setLoading(true)} className="underline mt-2">إعادة المحاولة</button>
          </div>
        ) : (
          <img 
            src={getPageUrl(page)}
            alt={`Page ${page}`} 
            className={`h-full object-contain shadow-xl max-w-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setImageError(true); }}
          />
        )}
      </div>
    </div>
  );
}