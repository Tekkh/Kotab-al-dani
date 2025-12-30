import { useState, useEffect, useMemo } from 'react';
import { FileText, BookOpen, Download, Book, Search, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';
import axios from 'axios';

interface Matn { id: number; title: string; author: string; description: string; pdf_file: string; }
interface TajweedLesson { id: number; title: string; content: string; }

interface TafsirAyah {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
  ayah_text: string;
}

interface Chapter {
  id: number;
  name_arabic: string;
  verses_count: number; 
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'tafsir' | 'tajweed' | 'matoon'>('tafsir');
  
  // بيانات التفسير
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [tafsirResult, setTafsirResult] = useState<TafsirAyah | null>(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);

  const [matoon, setMatoon] = useState<Matn[]>([]);
  const [tajweedLessons, setTajweedLessons] = useState<TajweedLesson[]>([]);

  useEffect(() => {
    // جلب قائمة السور
    axios.get('https://api.quran.com/api/v4/chapters?language=ar')
      .then(res => setChapters(res.data.chapters))
      .catch(console.error);

    apiClient.get('/library/matoon/').then(res => setMatoon(res.data));
    apiClient.get('/library/tajweed/').then(res => setTajweedLessons(res.data));
  }, []);


  const currentSurahVerseCount = useMemo(() => {
    const surah = chapters.find(c => c.id === selectedSurah);
    return surah ? surah.verses_count : 7;
  }, [selectedSurah, chapters]);

  // دالة لتغيير السورة وتصفير الآية
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSurah(Number(e.target.value));
    setSelectedAyah(1); 
    setTafsirResult(null); 
  };

  const handleFetchTafsir = async (e: React.FormEvent) => {
    e.preventDefault();
    setTafsirLoading(true);
    setTafsirResult(null);
    try {
      const res = await apiClient.get(`/library/tafsir-proxy/${selectedSurah}/${selectedAyah}/`);
      setTafsirResult(res.data);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء جلب البيانات");
    } finally {
      setTafsirLoading(false);
    }
  };

  return (
    <Layout title="المكتبة العلمية">
      <div className="space-y-6">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">المكتبة العلمية</h2>
          <p className="text-gray-500 text-sm">مصادر مساعدة لرحلة الحفظ والفهم</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-1.5 flex gap-2 overflow-x-auto border border-gray-100">
            <button onClick={() => setActiveTab('tafsir')} className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${activeTab === 'tafsir' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
              <BookOpen size={18} /> التفسير
            </button>
            <button onClick={() => setActiveTab('tajweed')} className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${activeTab === 'tajweed' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
              <FileText size={18} /> التجويد
            </button>
            <button onClick={() => setActiveTab('matoon')} className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${activeTab === 'matoon' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Book size={18} /> المتون
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[400px] p-6">
          
          {activeTab === 'tafsir' && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleFetchTafsir} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  
                  {/* قائمة السور */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">السورة</label>
                    <select 
                      value={selectedSurah}
                      onChange={handleSurahChange} 
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white cursor-pointer"
                    >
                      {chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_arabic}</option>
                      ))}
                    </select>
                  </div>

                  {/* قائمة الآيات (ديناميكية) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الآية (من 1 إلى {currentSurahVerseCount})</label>
                    <select 
                      value={selectedAyah}
                      onChange={(e) => setSelectedAyah(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white cursor-pointer"
                    >
                      {/* إنشاء مصفوفة بأرقام الآيات بناءً على العدد */}
                      {Array.from({ length: currentSurahVerseCount }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                </div>
                <button 
                  type="submit" 
                  disabled={tafsirLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {tafsirLoading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                  عرض التفسير الميسر
                </button>
              </form>

              {/* عرض النتيجة */}
              {tafsirResult && (
                <div className="animate-fade-in mt-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-2 font-cairo">
                      سورة {chapters.find(c => c.id === selectedSurah)?.name_arabic}
                    </h3>
                    <span className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold border border-emerald-100">
                      الآية {tafsirResult.ayah_number}
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                    <div className="bg-[#fffdf5] p-8 border-b border-emerald-50 text-center relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200"></div>
                      <p className="text-3xl leading-loose text-gray-800 font-amiri" dir="rtl">
                        {tafsirResult.ayah_text}
                      </p>
                    </div>

                    <div className="p-8 bg-white relative">
                       <div className="absolute top-4 right-4 text-emerald-100 opacity-50 text-6xl font-serif leading-none">“</div>
                       <h4 className="text-sm font-bold text-gray-400 mb-2">التفسير الميسر:</h4>
                       <p className="text-lg leading-relaxed text-gray-600 font-medium relative z-10 text-justify">
                         {tafsirResult.text}
                       </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* المحتويات الأخرى (التجويد والمتون) كما هي */}
          {activeTab === 'tajweed' && (
            <div className="space-y-3">
              {tajweedLessons.length > 0 ? (
                tajweedLessons.map((lesson, index) => (
                  <details 
                    key={lesson.id} 
                    className="group border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md open:shadow-md open:border-emerald-200 open:bg-emerald-50/30 w-full"
                  >
                    {/* العنوان */}
                    <summary className="flex justify-between items-center p-4 md:p-5 cursor-pointer font-bold text-gray-800 group-open:text-emerald-800 select-none list-none gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 group-open:bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0 transition-colors">
                          {index + 1}
                        </span>
                        <span className="text-base md:text-lg truncate">{lesson.title}</span>
                      </div>
                      <span className="text-gray-400 group-open:text-emerald-600 group-open:rotate-180 transition-transform duration-300 shrink-0">
                        ▼
                      </span>
                    </summary>
                    
                    {/* المحتوى المنسدل */}
                    <div className="px-4 pb-6 pt-2 md:px-6 md:pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50 animate-fade-in w-full overflow-hidden">
                      
                      {/* تنسيق المحتوى الداخلي ليحترم الموبايل */}
                      <div 
                        className="
                          prose max-w-none font-medium text-sm md:text-base
                          prose-p:my-2 prose-ul:my-2 prose-li:my-1
                          prose-headings:text-emerald-800 prose-headings:text-base md:prose-headings:text-lg
                          prose-span:break-words prose-span:inline-block
                          [&_*]:max-w-full [&_span.font-amiri]:text-lg md:[&_span.font-amiri]:text-xl [&_span.font-amiri]:leading-loose
                        "
                        dangerouslySetInnerHTML={{ __html: lesson.content }} 
                      />
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-center py-10 text-gray-400">لا توجد دروس تجويد متاحة حالياً.</p>
              )}
            </div>
          )}
          {activeTab === 'matoon' && (
             <div className="grid md:grid-cols-2 gap-6">
                {matoon.length > 0 ? matoon.map(m => (
                  <div key={m.id} className="flex flex-col p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-all bg-white group h-full">
                     
                     {/* المحتوى العلوي المساحة المتبقية) */}
                     <div className="flex-1 mb-6">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">
                             {m.title}
                           </h3>
                           <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                             <Book size={20} />
                           </div>
                        </div>
                        
                        <p className="text-sm text-emerald-600 font-medium mb-3 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                          {m.author}
                        </p>
                        
                        {m.description && (
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {m.description}
                          </p>
                        )}
                     </div>
                     
                     {/* زر التحميل (في الأسفل دائماً) */}
                     <a 
                       href={m.pdf_file} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="w-full py-3 bg-gray-50 hover:bg-emerald-600 text-gray-600 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border border-gray-100 hover:border-transparent group-hover:shadow-sm"
                     >
                       <Download size={18} />
                       <span>تحميل نسخة PDF</span>
                     </a>
                  </div>
                )) : <p className="text-center py-10 text-gray-400 col-span-full">لا توجد متون متاحة حالياً.</p>}
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}