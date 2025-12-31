import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  ChevronRight, ChevronLeft, Loader2, 
  BookOpen, Bookmark, Save, X, ZoomIn, ZoomOut, RotateCcw, Maximize2, Layers
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [savedPage, setSavedPage] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- التحضير والبيانات ---
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

  const getPageUrl = (pageNum: number) => 
    `https://cdn.jsdelivr.net/gh/Tekkh/quran-warsh@main/images/page${pageNum}.jpg`;

  const goToNextPage = useCallback(() => setPage(p => Math.min(604, p + 1)), []);
  const goToPrevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);

  // التعامل مع لوحة المفاتيح
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
    
    // تفعيل ملء الشاشة للمتصفح
    if (newState && containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
    } else if (!newState && document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
  };

  const handleSaveBookmark = () => {
    localStorage.setItem('quran_bookmark', page.toString());
    setSavedPage(page);
    alert("تم حفظ العلامة");
  };

  const goToBookmark = () => { if (savedPage) setPage(savedPage); };

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
          ? 'fixed inset-0 z-[100] h-screen w-screen' // أزلنا bg-black واستخدمنا الخلفية البيضاء
          : 'relative h-[850px] rounded-2xl shadow-sm border border-gray-200'
        }
      `}
    >
      {/* === الشريط العلوي (Header) === */}
      <div className={`
        absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 p-2 transition-transform duration-300 shadow-sm
        ${isFullscreen ? (showControls ? 'translate-y-0' : '-translate-y-full') : 'translate-y-0 relative'}
      `}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          
          <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
             {isFullscreen && (
               <button onClick={() => toggleFullscreen(false)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                 <X size={20} />
               </button>
             )}

            {/* قائمة السور */}
            <div className="relative group">
              <BookOpen size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
              <select 
                value={selectedSurah}
                onChange={(e) => {
                  const ch = chapters.find(c => c.id === Number(e.target.value));
                  if(ch) setPage(ch.pages[0]);
                }}
                className="appearance-none pl-4 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none w-32 cursor-pointer focus:ring-2 focus:ring-emerald-500"
              >
                {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_arabic}</option>)}
              </select>
            </div>

            {/* قائمة الأحزاب - تم ربطها الآن بشكل صحيح */}
            <div className="relative group hidden sm:block">
              <Layers size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
              <select 
                onChange={handleHizbChange} 
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none w-32 cursor-pointer focus:ring-2 focus:ring-emerald-500"
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
                className="w-14 pl-1 pr-1 py-2 text-center bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={goToBookmark} disabled={!savedPage} className={`p-2 rounded-lg transition-colors ${savedPage ? 'text-yellow-600 bg-yellow-50' : 'text-gray-300'}`}>
              <Bookmark size={20} fill={savedPage ? "currentColor" : "none"} />
            </button>
            <button onClick={handleSaveBookmark} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
              <Save size={20} />
            </button>
            {!isFullscreen && (
              <button onClick={() => toggleFullscreen(true)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <Maximize2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* === منطقة عرض المصحف (مع التكبير) === */}
      <div className="flex-1 relative flex justify-center items-center overflow-hidden bg-white">
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-2" />
            <span className="text-gray-500 text-sm">جاري التحميل...</span>
          </div>
        )}

        {/* مكون التكبير والسحب */}
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={4}
          centerOnInit={true}
          doubleClick={{ disabled: true }} // تعطيل النقر المزدوج لتجنب التعارض
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* أدوات التحكم العائمة للتكبير */}
              <div className={`absolute bottom-20 left-4 z-40 flex flex-col gap-2 transition-opacity duration-300 ${!showControls && isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button onClick={() => zoomIn()} className="p-3 bg-white/90 shadow-lg rounded-full text-gray-700 hover:text-emerald-600 backdrop-blur-sm border border-gray-100">
                    <ZoomIn size={20} />
                </button>
                <button onClick={() => zoomOut()} className="p-3 bg-white/90 shadow-lg rounded-full text-gray-700 hover:text-emerald-600 backdrop-blur-sm border border-gray-100">
                    <ZoomOut size={20} />
                </button>
                <button onClick={() => resetTransform()} className="p-3 bg-white/90 shadow-lg rounded-full text-gray-700 hover:text-red-600 backdrop-blur-sm border border-gray-100">
                    <RotateCcw size={20} />
                </button>
              </div>

              {/* الصورة داخل مكون التحويل */}
              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                {!error ? (
                  <img 
                    src={getPageUrl(page)} 
                    alt={`Page ${page}`} 
                    className="max-h-full w-auto max-w-full object-contain cursor-grab active:cursor-grabbing"
                    onLoad={() => setLoading(false)}
                    onError={() => { setLoading(false); setError(true); }}
                    // عند النقر على الصورة، نبدل ظهور الأدوات
                    onClick={() => {
                        if (isFullscreen) setShowControls(!showControls);
                    }}
                  />
                ) : (
                  <div className="text-red-500">فشل تحميل الصفحة</div>
                )}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {/* أزرار التنقل الجانبية */}
        <button 
           className={`absolute inset-y-0 left-0 w-16 flex items-center justify-start pl-2 z-30 outline-none ${(!showControls && isFullscreen) ? 'hidden' : 'block'}`}
           onClick={(e) => { e.stopPropagation(); goToNextPage(); }}
        >
          <div className="bg-white/80 p-2 rounded-full shadow-md text-gray-600 hover:text-emerald-600 backdrop-blur-sm hover:scale-110 transition-transform">
            <ChevronLeft size={24} />
          </div>
        </button>

        <button 
           className={`absolute inset-y-0 right-0 w-16 flex items-center justify-end pr-2 z-30 outline-none ${(!showControls && isFullscreen) ? 'hidden' : 'block'}`}
           onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}
        >
           <div className="bg-white/80 p-2 rounded-full shadow-md text-gray-600 hover:text-emerald-600 backdrop-blur-sm hover:scale-110 transition-transform">
            <ChevronRight size={24} />
          </div>
        </button>

        {/* رقم الصفحة */}
        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800/80 text-white px-4 py-1 rounded-full text-xs font-mono backdrop-blur-md transition-opacity duration-300 z-30 ${(!showControls && isFullscreen) ? 'opacity-0' : 'opacity-100'}`}>
          {page}
        </div>

      </div>
    </div>
  );
}