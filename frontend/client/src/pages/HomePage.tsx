import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Calendar, Clock, Users, Phone, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/Logo.svg'; 
import patternImage from '../assets/pattern.svg';

interface Lesson {
  id: number;
  day_of_week: string;
  time_description: string;
  lesson_title: string;
}

export default function HomePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/lessons/')
      .then(res => setLessons(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-white font-cairo" dir="rtl">
      
      {/* --- 1. رأس الصفحة --- */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          
          {/* الشعار والعنوان */}
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src={logoImage} 
              alt="شعار الكتاب" 
              className="w-9 h-9 md:w-11 md:h-11 object-contain drop-shadow-sm"
            />
            {/* إخفاء العنوان في الموبايل */}
            <span className="hidden sm:block text-lg md:text-xl font-bold text-gray-800">
              كُتّاب أبي عمرو الداني
            </span>
          </div>
          
          {/* الأزرار */}
          <div className="flex items-center gap-2 md:gap-4">
            {isLoggedIn ? (
              <Link to="/dashboard" className="px-4 py-1.5 md:px-6 md:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm md:text-base rounded-full font-bold shadow-sm transition-all whitespace-nowrap">
                لوحة التحكم
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 md:px-5 md:py-2 text-gray-600 hover:text-emerald-600 text-sm md:text-base font-bold transition-colors whitespace-nowrap">
                  دخول
                </Link>
                <Link to="/register" className="px-4 py-1.5 md:px-5 md:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-base rounded-full font-bold shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                  حساب جديد
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- 2. القسم الرئيسي (Hero) --- */}
      <div className="relative overflow-hidden bg-gray-50 py-16 md:py-20 border-b border-gray-200">
        
        {/* زخرفة خلفية: نمط الدوائر المتداخلة (Moroccan) */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
             backgroundImage: `url(${patternImage})`,
             opacity: 0.2, // شفافية خفيفة
             backgroundSize: '60px 60px', // حجم التكرار (عدله حسب حجم صورتك)
             backgroundRepeat: 'repeat'
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <span className="bg-white text-emerald-700 px-6 py-2 rounded-full text-xs md:text-sm font-bold border border-gray-200 shadow-sm">
              مقرأة إلكترونية بمنهجية أصيلة
            </span>
          </div>
          
          {/* صورة الآية */}
          <div className="mb-8 flex justify-center items-center">
             <img 
               src="/assets/images/quran-ayah.svg" 
               alt="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
               className="h-40 md:h-56 lg:h-72 w-auto object-contain drop-shadow-sm select-none" 
             />
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-medium max-w-xl mx-auto">
            بيئة قرآنية تعينك على ضبط الحفظ ومراجعته، وفق رواية ورش عن نافع،
            مع العناية بالمتون العلمية والتوجيه التربوي.
          </p>
          
          {!isLoggedIn && (
            <div className="flex justify-center">
              <Link to="/register" className="px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                <Heart className="w-5 h-5" fill="currentColor" />
                انضم لركب الحفاظ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- 3. قسم المنهجية --- */}
      <div className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">منهجية الكُتّاب</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full opacity-80"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <BookOpen size={32} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">رواية ورش عن نافع</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                نعتمد في التحفيظ والتسميع رواية ورش من طريق الأزرق، مع العناية بأصول الرواية وتحريراتها.
              </p>
            </div>

            <div className="p-6 group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <CheckCircle2 size={32} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">مرونة في الحفظ</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                لا نلزمك بمقدار محدد؛ يمكنك الحفظ بالثمن، الربع، أو الحزب حسب طاقتك ووقتك.
              </p>
            </div>

            <div className="p-6 group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Users size={32} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">صحبة القرآن</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                دروس أسبوعية في التفسير والمتون العلمية (كالدرر اللوامع) لربط الحفظ بالفهم والعمل.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. برنامج الدروس --- */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">برنامج الدروس الأسبوعي</h2>
            <p className="text-gray-500 font-medium">مجالس علمية عامة في رحاب الكتاب</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {lessons.length > 0 ? lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold">
                    {lesson.day_of_week}
                  </span>
                  <Calendar className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 min-h-[3rem] leading-snug">{lesson.lesson_title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm border-t border-gray-50 pt-4">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{lesson.time_description}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 col-span-3 text-center py-8">جاري تحديث الجدول...</p>
            )}
          </div>
        </div>
      </div>

      {/* --- 5. حلقات التحفيظ للأطفال --- */}
      <div className="py-16 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">حلقات التحفيظ للأطفال والناشئة</h2>
          <p className="text-emerald-100 mb-10 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            نولي عناية خاصة بالنشء لغرس حب القرآن في قلوبهم. تتوفر حلقات خاصة للأطفال بإشراف مباشر في جو آمن ومحفز.
          </p>
          
          <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
            <div className="text-center md:text-right">
              <p className="text-emerald-200 text-sm font-bold mb-1">للاستفسار والتسجيل</p>
              <p className="text-white text-xl font-extrabold">تواصل مباشرة مع الشيخ المشرف</p>
            </div>
            <div className="h-12 w-px bg-white/20 hidden md:block"></div>
            <a href="tel:+212000000000" className="flex items-center gap-3 bg-white text-emerald-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl group">
              <Phone size={20} className="group-hover:rotate-12 transition-transform" />
              <span dir="ltr" className="text-lg">+212 6 00 00 00 00</span>
            </a>
          </div>
        </div>
      </div>

      {/* التذييل */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4 opacity-70">
          <img src={logoImage} alt="Logo" className="w-6 h-6 object-contain grayscale" />
          <span className="font-bold text-gray-600">كُتّاب أبي عمرو الداني</span>
        </div>
        <p className="text-gray-400 text-xs font-medium">© {new Date().getFullYear()} جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}