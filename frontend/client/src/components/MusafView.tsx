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
      
      {/* --- الشريط العلوي (يختفي في وضع ملء الشاشة لإعطاء مساحة أكبر، أو يمكن إبقاؤه) --- */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col xl:flex-row gap-4 justify-between items-center text-sm">
        
        {/* أدوات التنقل السريع */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center">
          {/* قائمة السور */}
          <div className="flex items-center gap-1 bg-white border rounded-lg px-2 py-1">
            <BookOpen size={16} className="text-emerald-600" />
            <select 
              value={selectedSurah}
              onChange={(e) => {
                const ch = chapters.find(c => c.id === Number(e.target.value));
                if(ch) setPage(ch.pages[0]);
              }}
              className="p-1 outline-none bg-transparent w-32 md:w-40"
            >
              {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_arabic}</option>)}
            </select>
          </div>

          {/* قائمة الأحزاب */}
          <div className="flex items-center gap-1 bg-white border rounded-lg px-2 py-1">
            <Layers size={16} className="text-emerald-600" />
            <select onChange={handleHizbChange} className="p-1 outline-none bg-transparent">
              <option value="">انتقال لحزب...</option>
              {Array.from({length: 60}, (_, i) => i + 1).map(h => (
                <option key={h} value={h}>الحزب {h}</option>
              ))}
            </select>
          </div>

          {/* البحث بالصفحة */}
          <form onSubmit={(e) => { e.preventDefault(); setPage(parseInt(inputPage) || 1); }} className="flex items-center relative">
            <input 
              type="number" min="1" max="604"
              value={inputPage} onChange={(e) => setInputPage(e.target.value)}
              className="w-16 p-1.5 pr-2 text-center border rounded-lg outline-none focus:border-emerald-500"
            />
            <span className="absolute left-8 text-gray-400 text-xs">ص</span>
          </form>
        </div>

        {/* أدوات التحكم والجماليات */}
        <div className="flex items-center gap-2">
          {/* زر العلامة المرجعية */}
          <button 
            onClick={goToBookmark} 
            disabled={!savedPage}
            title={savedPage ? `الذهاب للعلامة (ص ${savedPage})` : "لا توجد علامة محفوظة"}
            className={`p-2 rounded-lg border flex items-center gap-2 transition-colors ${savedPage ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
          >
            <Bookmark size={18} fill={savedPage ? "currentColor" : "none"} />
            <span className="hidden md:inline">المرجع</span>
          </button>

          <button 
            onClick={handleSaveBookmark}
            title="حفظ الصفحة الحالية كعلامة"
            className="p-2 rounded-lg border border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <Save size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
            title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* --- منطقة العرض --- */}
      <div className="flex-1 bg-[#fffdf5] flex justify-center items-center overflow-hidden relative group">
        
        {/* التحميل */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fffdf5] z-10">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
            <span className="text-emerald-800 font-medium animate-pulse">جاري جلب الصفحة...</span>
          </div>
        )}

        {/* الخطأ */}
        {error && (
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl">
            <p className="font-bold">فشل تحميل الصورة</p>
            <button onClick={() => setPage(page)} className="underline mt-2">إعادة المحاولة</button>
          </div>
        )}

        {/* الصورة */}
        {!error && (
          <img 
            src={getPageUrl(page)} 
            alt={`Page ${page}`} 
            className={`h-full w-auto object-contain shadow-2xl transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}

        {/* --- أسهم التنقل الشفافة (تظهر عند التحويم Hover) --- */}
        {/* زر التالي (اليسار) */}
        <button 
          onClick={goToNextPage}
          className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 focus:outline-none"
          title="الصفحة التالية (سهم يسار)"
        >
          <div className="bg-white/80 p-3 rounded-full shadow-lg backdrop-blur-sm text-gray-700 hover:text-emerald-600">
            <ChevronLeft size={32} />
          </div>
        </button>

        {/* زر السابق (اليمين) */}
        <button 
          onClick={goToPrevPage}
          className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 focus:outline-none"
          title="الصفحة السابقة (سهم يمين)"
        >
          <div className="bg-white/80 p-3 rounded-full shadow-lg backdrop-blur-sm text-gray-700 hover:text-emerald-600">
            <ChevronRight size={32} />
          </div>
        </button>

        {/* رقم الصفحة العائم في الأسفل */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-1 rounded-full text-sm font-mono backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          صفحة {page}
        </div>

      </div>
    </div>
  );
}