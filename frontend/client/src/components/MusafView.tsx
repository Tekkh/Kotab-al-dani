import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  ChevronRight, ChevronLeft, Search, Loader2, 
  BookOpen, Bookmark, Maximize2, Minimize2, 
  Layers, Save
} from 'lucide-react';

interface Chapter {
  id: number;
  name_arabic: string;
  pages: [number, number];
}

export default function MusafView() {
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // حالات البيانات
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  
  // حالات الواجهة الجديدة
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedPage, setSavedPage] = useState<number | null>(null);

  // --- 1. التحضير والبيانات ---
  useEffect(() => {
    // جلب السور
    axios.get('https://api.quran.com/api/v4/chapters?language=ar')
      .then(res => setChapters(res.data.chapters))
      .catch(console.error);

    // استعادة العلامة المرجعية من التخزين المحلي
    const saved = localStorage.getItem('quran_bookmark');
    if (saved) setSavedPage(parseInt(saved));
  }, []);

  // تحديث السورة بناءً على الصفحة
  useEffect(() => {
    if (chapters.length > 0) {
      const currentChapter = chapters.find(ch => page >= ch.pages[0] && page <= ch.pages[1]);
      if (currentChapter) setSelectedSurah(currentChapter.id);
    }
    
    setLoading(true);
    setError(false);
    setInputPage(page.toString());

    const img = new Image();
    img.src = getPageUrl(page);
    img.onload = () => setLoading(false);
    img.onerror = () => { setLoading(false); setError(true); };

  }, [page, chapters]);

  // --- 2. دوال التحكم ---
  const getPageUrl = (pageNum: number) => 
    `https://cdn.jsdelivr.net/gh/QuranHub/quran-pages-images@main/kfgqpc/warsh/${pageNum}.jpg`;

  const goToNextPage = useCallback(() => setPage(p => Math.min(604, p + 1)), []);
  const goToPrevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);

  // التعامل مع لوحة المفاتيح (الأسهم)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToNextPage(); // اليسار = التالي (في العربية)
      if (e.key === 'ArrowRight') goToPrevPage();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  // حفظ العلامة المرجعية
  const handleSaveBookmark = () => {
    localStorage.setItem('quran_bookmark', page.toString());
    setSavedPage(page);
    // (يمكن إضافة توست/إشعار هنا مستقبلاً)
  };

  // الذهاب للعلامة المحفوظة
  const goToBookmark = () => {
    if (savedPage) setPage(savedPage);
  };

  // التنقل بالأحزاب (معادلة تقريبية لمصحف المدينة/ورش 604 صفحة: الحزب = 10 صفحات تقريباً)
  const handleHizbChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hizb = Number(e.target.value);
    // معادلة تقريبية: الحزب 1 يبدأ ص2، الحزب 2 يبدأ ص11...
    const targetPage = (hizb - 1) * 10 + 2; 
    setPage(Math.min(604, targetPage));
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : 'h-[850px] relative'}`}>
      
      {/* --- الشريط العلوي (تم إعادة تصميمه بالكامل) --- */}
      <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 p-3 flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* المجموعة 1: أدوات التنقل (يمين) */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
          
          {/* قائمة السور - تصميم محسن */}
          <div className="relative group">
            <BookOpen size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
            <select 
              value={selectedSurah}
              onChange={(e) => {
                const ch = chapters.find(c => c.id === Number(e.target.value));
                if(ch) setPage(ch.pages[0]);
              }}
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all w-40 cursor-pointer"
            >
              {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_arabic}</option>)}
            </select>
          </div>

          {/* قائمة الأحزاب - تصميم محسن */}
          <div className="relative group">
            <Layers size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
            <select 
              onChange={handleHizbChange} 
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all w-32 cursor-pointer"
            >
              <option value="">الحزب...</option>
              {Array.from({length: 60}, (_, i) => i + 1).map(h => (
                <option key={h} value={h}>الحزب {h}</option>
              ))}
            </select>
          </div>

          {/* حقل رقم الصفحة - مدمج وأنيق */}
          <form onSubmit={(e) => { e.preventDefault(); setPage(parseInt(inputPage) || 1); }} className="relative flex items-center">
            <input 
              type="number" min="1" max="604"
              value={inputPage} onChange={(e) => setInputPage(e.target.value)}
              className="w-20 pl-2 pr-8 py-2 text-center border border-gray-300 rounded-xl text-sm font-bold text-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
            <span className="absolute right-3 text-xs text-gray-400 font-medium pointer-events-none">ص.</span>
          </form>
        </div>

        {/* المجموعة 2: أدوات الإجراءات (يسار) */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          
          {/* زر المرجع */}
          <button 
            onClick={goToBookmark} 
            disabled={!savedPage}
            title={savedPage ? `الذهاب للعلامة (ص ${savedPage})` : "لا توجد علامة محفوظة"}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              savedPage 
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <Bookmark size={16} fill={savedPage ? "currentColor" : "none"} />
            <span className="hidden sm:inline">المرجع</span>
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1"></div>

          {/* حفظ العلامة */}
          <button 
            onClick={handleSaveBookmark}
            title="حفظ الصفحة الحالية كعلامة"
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Save size={18} />
          </button>

          {/* ملء الشاشة */}
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* ... (باقي كود منطقة عرض الصورة يبقى كما هو تماماً) ... */}
      <div className="flex-1 bg-[#fffdf5] flex justify-center items-center overflow-hidden relative group">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fffdf5] z-10">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
            <span className="text-emerald-800 font-medium animate-pulse">جاري جلب الصفحة...</span>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl">
            <p className="font-bold">فشل تحميل الصورة</p>
            <button onClick={() => setPage(page)} className="underline mt-2">إعادة المحاولة</button>
          </div>
        )}

        {!error && (
          <img 
            src={getPageUrl(page)} 
            alt={`Page ${page}`} 
            className={`h-full w-auto object-contain shadow-2xl transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}

        {/* أزرار التنقل الجانبية الشفافة */}
        <button 
          onClick={goToNextPage}
          className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 focus:outline-none"
        >
          <div className="bg-white/90 p-2 rounded-full shadow-lg text-gray-700 hover:text-emerald-600">
            <ChevronLeft size={28} />
          </div>
        </button>

        <button 
          onClick={goToPrevPage}
          className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 focus:outline-none"
        >
          <div className="bg-white/90 p-2 rounded-full shadow-lg text-gray-700 hover:text-emerald-600">
            <ChevronRight size={28} />
          </div>
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full text-sm font-mono backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          صفحة {page}
        </div>
      </div>
    </div>
  );
}