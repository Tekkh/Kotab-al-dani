import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Calendar, Clock, Star, Award, BarChart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // 1. استيراد السياق

interface Lesson {
  id: number;
  day_of_week: string;
  time_description: string;
  lesson_title: string;
}

export default function HomePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { isLoggedIn } = useAuth(); // 2. معرفة حالة المستخدم

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/lessons/')
      .then(res => setLessons(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">
              ح
            </div>
            <span className="text-xl font-bold text-gray-800">كتاب أبي عمرو الداني</span>
          </div>
          
          {/* 3. أزرار ديناميكية بناءً على حالة التسجيل */}
          <div className="flex gap-4">
            {isLoggedIn ? (
              // إذا كان مسجلاً: زر واحد للذهاب للوحة التحكم
              <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-md transition-all">
                <LayoutDashboard size={18} />
                لوحة التحكم
              </Link>
            ) : (
              // إذا لم يكن مسجلاً: أزرار التسجيل والدخول
              <>
                <Link to="/login" className="px-5 py-2.5 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all">
                  ابدأ رحلتك
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ... (باقي الصفحة كما هو دون تغيير) ... */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
            منصة تعليمية متكاملة
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            ورتّل القرآن <span className="text-emerald-600">ترتيلاً</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            "من قرأ حرفاً من كتاب الله فله به حسنة، والحسنة بعشر أمثالها".
            انضم إلينا في رحلة ميسرة لحفظ كتاب الله، مع أدوات للمتابعة وبرنامج علمي متين.
          </p>
          <div className="flex justify-center gap-4">
            {isLoggedIn ? (
               <Link to="/dashboard" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-emerald-700 transition-all">
                 متابعة الحفظ
               </Link>
            ) : (
               <Link to="/register" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-emerald-700 transition-all">
                 إنشاء حساب مجاني
               </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* ... (تأكد من نسخ باقي الصفحة: قسم الدروس والميزات والتذييل) ... */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">برنامج الدروس الأسبوعي</h2>
            <p className="text-gray-500">دروس علمية منتظمة في التفسير والقراءات والمتون</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
                  <Calendar className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.day_of_week}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  {lesson.time_description}
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-700 font-medium">{lesson.lesson_title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">كيف يساعدك التطبيق؟</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: "المصحف التفاعلي", desc: "تتبع حفظك آية بآية" },
              { icon: BarChart, title: "إحصائيات دقيقة", desc: "راقب تقدمك بالرسوم البيانية" },
              { icon: Award, title: "نظام التحفيز", desc: "أوسمة وجوائز للاستمرار" },
              { icon: Star, title: "المكتبة العلمية", desc: "متون وتفاسير مساعدة" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl text-center shadow-sm">
                <div className="mx-auto w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>© 2025 تطبيق حفظ القرآن الكريم. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}