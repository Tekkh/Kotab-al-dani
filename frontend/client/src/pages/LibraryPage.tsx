import { useState, useEffect, useMemo } from 'react'; // أضفنا useMemo للأداء
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Download, ArrowRight, Book, Search, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';
import axios from 'axios';

// ... (الواجهات السابقة كما هي) ...
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

// [تحديث] إضافة عدد الآيات
interface Chapter {
  id: number;
  name_arabic: string;
  verses_count: number; // <--- حقل مهم جداً
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

  // [جديد] حساب عدد آيات السورة المختارة حالياً
  const currentSurahVerseCount = useMemo(() => {
    const surah = chapters.find(c => c.id === selectedSurah);
    return surah ? surah.verses_count : 7; // افتراضياً 7 (الفاتحة)
  }, [selectedSurah, chapters]);

  // [جديد] دالة لتغيير السورة وتصفير الآية
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSurah(Number(e.target.value));
    setSelectedAyah(1); // إعادة تعيين الآية للأولى عند تغيير السورة
    setTafsirResult(null); // إخفاء النتيجة السابقة
  };

  const handleFetchTafsir = async (e: React.FormEvent) => {
    e.preventDefault();
    setTafsirLoading(true);
    setTafsirResult(null);
    try {
      const res = await apiClient.get(`/proxy/tafsir/${selectedSurah}/${selectedAyah}/`);
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
                      onChange={handleSurahChange} // استخدام الدالة الجديدة
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

          {/* المحتويات الأخرى (التجويد والمتون) تبقى كما هي */}
          {activeTab === 'tajweed' && (
            <div className="space-y-3">
              {tajweedLessons.length > 0 ? (
                tajweedLessons.map((lesson) => (
                  <details 
                    key={lesson.id} 
                    className="group border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md open:shadow-md open:border-emerald-200 open:bg-emerald-50/30"
                  >
                    {/* العنوان (القابل للضغط) */}
                    <summary className="flex justify-between items-center p-5 cursor-pointer font-bold text-gray-800 group-open:text-emerald-800 select-none list-none">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-gray-100 group-open:bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-sm transition-colors">
                          {lesson.id}
                        </span>
                        <span className="text-lg">{lesson.title}</span>
                      </div>
                      <span className="text-gray-400 group-open:text-emerald-600 group-open:rotate-180 transition-transform duration-300">
                        ▼
                      </span>
                    </summary>
                    
                    {/* المحتوى المنسدل */}
                    <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50 animate-fade-in">
                      <div 
                        className="prose max-w-none font-medium"
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
             <div className="grid md:grid-cols-2 gap-4">
                {matoon.length > 0 ? matoon.map(m => (
                  <div key={m.id} className="p-4 border rounded-lg flex justify-between">
                     <div><h3 className="font-bold">{m.title}</h3><p className="text-xs">{m.author}</p></div>
                     <a href={m.pdf_file} target="_blank" className="text-emerald-600"><Download /></a>
                  </div>
                )) : <p className="text-center py-10 text-gray-400 col-span-2">لا توجد متون.</p>}
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}