import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  ChevronRight, ChevronLeft, Loader2, 
  BookOpen, Bookmark, Maximize2, Minimize2, 
  Layers, Save, X
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
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);

  // حالات العرض
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [savedPage, setSavedPage] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- 1. التحضير والبيانات ---
  useEffect(() => {
    axios.get('https://api.quran.com/api/v4/chapters?language=ar')
      .then(res => setChapters(res.data.chapters))
      .catch(console.error);

    const saved = localStorage.getItem('quran_bookmark');
    if (saved) setSavedPage(parseInt(saved));
  }, []);

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
    `https://cdn.jsdelivr.net/gh/Tekkh/quran-warsh@main/images/page${pageNum}.jpg`;

  const goToNextPage = useCallback(() => setPage(p => Math.min(604, p + 1)), []);
  const goToPrevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToNextPage();
      if (e.key === 'ArrowRight') goToPrevPage();
      if (e.key === 'Escape') toggleFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  const toggleFullscreen = (forceState?: boolean) => {
    const newState = forceState !== undefined ? forceState : !isFullscreen;
    setIsFullscreen(newState);
    setShowControls(true); 

    if (newState) {

      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {

      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleSaveBookmark = () => {
    localStorage.setItem('quran_bookmark', page.toString());
    setSavedPage(page);

    alert("تم حفظ العلامة");
  };

  const goToBookmark = () => {
    if (savedPage) setPage(savedPage);
  };

  const handleHizbChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hizb = Number(e.target.value);
    const targetPage = (hizb - 1) * 10 + 2; 
    setPage(Math.min(604, targetPage));
  };

  return (
    <div 
      ref={containerRef}
      className={`
        transition-all duration-300 flex flex-col overflow-hidden bg-white
        ${isFullscreen 
          ? 'fixed inset-0 z-[100] h-screen w-screen bg-black' 
          : 'relative h-[850px] rounded-2xl shadow-sm border border-gray-200'
        }
      `}
    >
      {/* === الشريط العلوي (Header) === 
        يختفي في وضع ملء الشاشة إذا ضغط المستخدم على الصفحة
      */}
      <div className={`
        absolute top-0 left-0 right-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-200 p-3 transition-transform duration-300
        ${isFullscreen ? (showControls ? 'translate-y-0' : '-translate-y-full') : 'translate-y-0 relative'}
      `}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* أدوات البحث والتنقل */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
             {/* زر إغلاق ملء الشاشة (يظهر فقط في وضع ملء الشاشة) */}
             {isFullscreen && (
               <button onClick={() => toggleFullscreen(false)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                 <X size={20} />
               </button>
             )}

            <div className="relative group">
              <BookOpen size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
              <select 
                value={selectedSurah}
                onChange={(e) => {
                  const ch = chapters.find(c => c.id === Number(e.target.value));
                  if(ch) setPage(ch.pages[0]);
                }}
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 outline-none w-36 cursor-pointer focus:ring-2 focus:ring-emerald-500"
              >
                {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_arabic}</option>)}
              </select>
            </div>

            <div className="relative group hidden sm:block">
              <Layers size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
              <select 
                onChange={handleHizbChange} 
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 outline-none w-32 cursor-pointer focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">الحزب...</option>
                {Array.from({length: 60}, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>الحزب {h}</option>
                ))}
              </select>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setPage(parseInt(inputPage) || 1); }} className="relative flex items-center">
              <input 
                type="number" min="1" max="604"
                value={inputPage} onChange={(e) => setInputPage(e.target.value)}
                className="w-16 pl-2 pr-6 py-2 text-center border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </form>
          </div>

          {/* أدوات الإجراءات */}
          <div className="flex items-center gap-2">
            <button 
              onClick={goToBookmark} 
              disabled={!savedPage}
              className={`p-2 rounded-lg transition-colors ${savedPage ? 'text-yellow-600 bg-yellow-50' : 'text-gray-300'}`}
              title="الذهاب للعلامة"
            >
              <Bookmark size={20} fill={savedPage ? "currentColor" : "none"} />
            </button>

            <button 
              onClick={handleSaveBookmark}
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              title="حفظ العلامة"
            >
              <Save size={20} />
            </button>

            {/* زر التكبير (يختفي داخل وضع ملء الشاشة لتجنب التكرار) */}
            {!isFullscreen && (
              <button 
                onClick={() => toggleFullscreen(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Maximize2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* === منطقة عرض المصحف === 
        الضغط هنا يبدل حالة ظهور الأدوات (showControls)
      */}
      <div 
        className={`flex-1 relative flex justify-center items-center overflow-hidden cursor-pointer ${isFullscreen ? 'bg-black' : 'bg-[#fffdf5]'}`}
        onClick={() => isFullscreen && setShowControls(!showControls)}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
            <span className="text-emerald-800 font-medium">جاري التحميل...</span>
          </div>
        )}

        {error ? (
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl">
            <p className="font-bold">فشل تحميل الصفحة</p>
            <button onClick={() => setPage(page)} className="underline mt-2">إعادة المحاولة</button>
          </div>
        ) : (
          <img 
            src={getPageUrl(page)} 
            alt={`Page ${page}`} 
            className={`
              transition-opacity duration-300 object-contain shadow-lg
              ${loading ? 'opacity-0' : 'opacity-100'}
              ${isFullscreen ? 'max-h-screen w-full h-full' : 'max-h-full w-auto'}
            `}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}

        {/* أزرار التنقل الجانبية (تظهر فقط عند تمرير الماوس أو إذا كانت الأدوات ظاهرة) */}
        <div 
           className={`absolute inset-y-0 left-0 w-16 md:w-24 flex items-center justify-start pl-2 z-10 transition-opacity duration-300 ${(!showControls && isFullscreen) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
           onClick={(e) => { e.stopPropagation(); goToNextPage(); }} 
        >
          <button className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg transform hover:scale-110">
            <ChevronLeft size={32} />
          </button>
        </div>

        <div 
           className={`absolute inset-y-0 right-0 w-16 md:w-24 flex items-center justify-end pr-2 z-10 transition-opacity duration-300 ${(!showControls && isFullscreen) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
           onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}
        >
          <button className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg transform hover:scale-110">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* رقم الصفحة العائم (يختفي مع الأدوات) */}
        <div className={`
          absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm font-mono backdrop-blur-md transition-opacity duration-300
          ${(!showControls && isFullscreen) ? 'opacity-0' : 'opacity-100'}
        `}>
          {page}
        </div>

      </div>
    </div>
  );
}