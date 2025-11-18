import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Download, ArrowRight, Book } from 'lucide-react';
import apiClient from '../api/apiClient';

// 1. تعريف أنواع البيانات (مطابقة للـ API)
interface Matn {
  id: number;
  title: string;
  author: string;
  description: string;
  pdf_file: string; // رابط الملف
}

interface TajweedLesson {
  id: number;
  title: string;
  content: string;
}

interface Tafsir {
  id: number;
  surah_id: number;
  surah_name: string;
  text: string;
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'tafsir' | 'tajweed' | 'matoon'>('tafsir');
  
  // 2. حالات لتخزين البيانات القادمة من الخادم
  const [matoon, setMatoon] = useState<Matn[]>([]);
  const [tajweedLessons, setTajweedLessons] = useState<TajweedLesson[]>([]);
  const [tafsirList, setTafsirList] = useState<Tafsir[]>([]);
  
  // حالة للتفسير المختار (أول سورة افتراضياً)
  const [selectedTafsir, setSelectedTafsir] = useState<Tafsir | null>(null);

  // 3. جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب المتون
        const matoonRes = await apiClient.get('/library/matoon/');
        setMatoon(matoonRes.data);

        // جلب التجويد
        const tajweedRes = await apiClient.get('/library/tajweed/');
        setTajweedLessons(tajweedRes.data);

        // جلب التفسير
        const tafsirRes = await apiClient.get('/library/tafsir/');
        setTafsirList(tafsirRes.data);
        
        // تحديد التفسير الافتراضي (أول واحد في القائمة)
        if (tafsirRes.data.length > 0) {
          setSelectedTafsir(tafsirRes.data[0]);
        }

      } catch (error) {
        console.error("فشل جلب بيانات المكتبة:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* زر العودة */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium">
            <ArrowRight size={20} />
            العودة للوحة التحكم
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">المكتبة العلمية</h1>
          <p className="text-gray-500">مصادر مساعدة لرحلة الحفظ والفهم (محتوى متجدد)</p>
        </div>

        {/* شريط التبويبات */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-8 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tafsir')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'tafsir' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={20} />
            التفسير
          </button>
          
          <button
            onClick={() => setActiveTab('tajweed')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'tajweed' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FileText size={20} />
            التجويد
          </button>
          
          <button
            onClick={() => setActiveTab('matoon')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'matoon' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Book size={20} />
            المتون
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] p-8">
          
          {/* 1. محتوى التفسير */}
          {activeTab === 'tafsir' && (
            <div>
              {tafsirList.length > 0 ? (
                <>
                  <div className="flex gap-4 mb-6">
                    <label className="flex items-center text-gray-700 font-bold">اختر السورة:</label>
                    <select 
                      className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      onChange={(e) => {
                        const selected = tafsirList.find(t => t.id === Number(e.target.value));
                        setSelectedTafsir(selected || null);
                      }}
                      value={selectedTafsir?.id}
                    >
                      {tafsirList.map(t => (
                        <option key={t.id} value={t.id}>{t.surah_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="prose max-w-none bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-emerald-800 mb-4">تفسير {selectedTafsir?.surah_name}</h3>
                    <p className="leading-relaxed text-gray-700 text-lg whitespace-pre-line">
                      {selectedTafsir?.text}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400 py-10">لا توجد تفاسير متاحة حالياً.</p>
              )}
            </div>
          )}

          {/* 2. محتوى التجويد */}
          {activeTab === 'tajweed' && (
            <div className="space-y-4">
              {tajweedLessons.length > 0 ? (
                tajweedLessons.map((lesson) => (
                  <details key={lesson.id} className="group border border-gray-200 rounded-lg open:bg-emerald-50 transition-colors">
                    <summary className="flex justify-between items-center p-4 cursor-pointer font-bold text-gray-800 group-open:text-emerald-800">
                      {lesson.title}
                      <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                      {lesson.content}
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-center text-gray-400 py-10">لا توجد دروس تجويد متاحة حالياً.</p>
              )}
            </div>
          )}

          {/* 3. محتوى المتون */}
          {activeTab === 'matoon' && (
            <div className="grid md:grid-cols-2 gap-6">
              {matoon.length > 0 ? (
                matoon.map((book) => (
                  <div key={book.id} className="border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{book.title}</h3>
                      <p className="text-sm text-emerald-600 mb-2">{book.author}</p>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">PDF</span>
                    </div>
                    <a 
                      href={book.pdf_file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors flex items-center gap-2"
                    >
                      <Download size={20} />
                      <span className="text-sm font-bold">تحميل</span>
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-10 col-span-2">لا توجد متون متاحة حالياً.</p>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}