import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  ChevronRight, ChevronLeft, Loader2, 
  BookOpen, Bookmark, Save, X, Maximize2, Layers,
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
  
  // حالات العرض
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [savedPage, setSavedPage] = useState<number | null>(null);
  
  // تتبع حالة التكبير للسماح بالسحب
  const [currentScale, setCurrentScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // متغيرات لمعالجة السحب (Swipe)
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50; 

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

  const goToNextPage = useCallback(() => {
    setPage(p => Math.min(604, p + 1));
    setCurrentScale(1); 
  }, []);

  const goToPrevPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
    setCurrentScale(1);
  }, []);

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

  // --- منطق السحب (Swipe Logic) ---
  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null; 
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    // نسمح بالسحب فقط إذا كانت الصورة بحجمها الطبيعي (غير مكبرة)
    if (currentScale > 1.1) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) goToNextPage();
    if (isRightSwipe) goToPrevPage();
  };

  return (
    <div 
      ref={containerRef}
      className={`
        transition-all duration-300 flex flex-col overflow-hidden
        ${isFullscreen 
          ? 'fixed inset-0 z-[100] h-screen w-screen bg-black' 
          : 'relative h-[850px] rounded-2xl shadow-sm border border-gray-200 bg-white'
        }
      `}
    >
      {/* === الشريط العلوي === */}
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

      {/* === منطقة عرض المصحف === */}
      <div 
        className={`flex-1 relative flex justify-center items-center overflow-hidden ${isFullscreen ? 'bg-black' : 'bg-white'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 z-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-2" />
          </div>
        )}

        {/* ✅ الإصلاح هنا: أزلنا الدوال غير المستخدمة واستخدمنا المكون مباشرة */}
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={4}
          centerOnInit={true}
          doubleClick={{ disabled: true }}
          onTransformed={(e) => setCurrentScale(e.state.scale)}
        >
          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-full !h-full flex items-center justify-center"
          >
            {!error ? (
              <img 
                src={getPageUrl(page)} 
                alt={`Page ${page}`} 
                className="max-h-full w-auto max-w-full object-contain"
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
                // النقر على الصورة يخفي/يظهر الأدوات
                onClick={() => {
                   if (isFullscreen) setShowControls(prev => !prev);
                }}
              />
            ) : (
              <div className="text-red-500">فشل تحميل الصفحة</div>
            )}
          </TransformComponent>
        </TransformWrapper>

        {/* أزرار تنقل مخفية في وضع ملء الشاشة لكنها تعمل عند الحاجة */}
        {!isFullscreen && (
          <>
            <button 
              className="absolute inset-y-0 left-0 w-12 flex items-center justify-center z-30 opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); goToNextPage(); }}
            >
              <div className="bg-black/20 p-2 rounded-full text-white"><ChevronLeft /></div>
            </button>
            <button 
              className="absolute inset-y-0 right-0 w-12 flex items-center justify-center z-30 opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}
            >
              <div className="bg-black/20 p-2 rounded-full text-white"><ChevronRight /></div>
            </button>
          </>
        )}

        {/* رقم الصفحة */}
        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/80 text-white px-4 py-1 rounded-full text-xs font-mono backdrop-blur-md transition-opacity duration-300 z-30 ${(!showControls && isFullscreen) ? 'opacity-0' : 'opacity-100'}`}>
          {page}
        </div>

      </div>
    </div>
  );
}