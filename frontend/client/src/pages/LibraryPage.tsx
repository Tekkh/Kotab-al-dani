import { useState, useEffect } from 'react';
import { FileText, BookOpen, Download, Book } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout'; // 1. استيراد التخطيط

// (الواجهات interfaces تبقى كما هي...)
interface Matn { id: number; title: string; author: string; description: string; pdf_file: string; }
interface TajweedLesson { id: number; title: string; content: string; }
interface Tafsir { id: number; surah_id: number; surah_name: string; text: string; }

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'tafsir' | 'tajweed' | 'matoon'>('tafsir');
  const [matoon, setMatoon] = useState<Matn[]>([]);
  const [tajweedLessons, setTajweedLessons] = useState<TajweedLesson[]>([]);
  const [tafsirList, setTafsirList] = useState<Tafsir[]>([]);
  const [selectedTafsir, setSelectedTafsir] = useState<Tafsir | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matoonRes = await apiClient.get('/library/matoon/');
        setMatoon(matoonRes.data);
        const tajweedRes = await apiClient.get('/library/tajweed/');
        setTajweedLessons(tajweedRes.data);
        const tafsirRes = await apiClient.get('/library/tafsir/');
        setTafsirList(tafsirRes.data);
        if (tafsirRes.data.length > 0) setSelectedTafsir(tafsirRes.data[0]);
      } catch (error) {
        console.error("فشل جلب بيانات المكتبة:", error);
      }
    };
    fetchData();
  }, []);

  return (
    // 2. تغليف الصفحة بـ Layout
    <Layout title="المكتبة العلمية">
      <div className="space-y-6">
        
        {/* (تم حذف زر العودة لأنه موجود في القائمة الآن) */}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">المكتبة العلمية</h2>
          <p className="text-gray-500 text-sm">مصادر مساعدة لرحلة الحفظ والفهم</p>
        </div>

        {/* شريط التبويبات */}
        <div className="bg-white rounded-2xl shadow-sm p-1.5 flex gap-2 overflow-x-auto border border-gray-100">
          {[
            { id: 'tafsir', label: 'التفسير', icon: BookOpen },
            { id: 'tajweed', label: 'التجويد', icon: FileText },
            { id: 'matoon', label: 'المتون', icon: Book },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                activeTab === tab.id 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[400px] p-6">
          {/* 1. محتوى التفسير */}
          {activeTab === 'tafsir' && (
            <div>
              {tafsirList.length > 0 ? (
                <>
                  <div className="flex gap-4 mb-6 items-center">
                    <label className="text-gray-700 font-bold whitespace-nowrap">اختر السورة:</label>
                    <select 
                      className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
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
                    <h3 className="text-lg font-bold text-emerald-800 mb-3">تفسير {selectedTafsir?.surah_name}</h3>
                    <p className="leading-relaxed text-gray-700 whitespace-pre-line">
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
            <div className="space-y-3">
              {tajweedLessons.length > 0 ? (
                tajweedLessons.map((lesson) => (
                  <details key={lesson.id} className="group border border-gray-200 rounded-xl open:bg-emerald-50/50 transition-colors">
                    <summary className="flex justify-between items-center p-4 cursor-pointer font-bold text-gray-800 group-open:text-emerald-800 select-none">
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
            <div className="grid md:grid-cols-2 gap-4">
              {matoon.length > 0 ? (
                matoon.map((book) => (
                  <div key={book.id} className="border border-gray-200 rounded-xl p-5 flex justify-between items-center hover:shadow-md transition-shadow bg-white">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{book.title}</h3>
                      <p className="text-sm text-emerald-600 mb-1">{book.author}</p>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">PDF</span>
                    </div>
                    <a 
                      href={book.pdf_file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors flex items-center gap-2"
                      title="تحميل"
                    >
                      <Download size={18} />
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
    </Layout>
  );
}