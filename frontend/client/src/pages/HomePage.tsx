import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Calendar, Clock, Users, Phone, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      <nav className="bg-gray-50/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">
              ح
            </div>
            <span className="text-xl font-bold text-gray-800">كُتّاب أبي عمرو الداني</span>
          </div>
          
          <div className="flex gap-4">
            {isLoggedIn ? (
              <Link to="/dashboard" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-sm transition-all">
                لوحة التحكم
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-gray-600 hover:text-emerald-600 font-bold transition-colors">
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all">
                  التسجيل
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- 2. القسم الرئيسي (تم تعديل الخلفية واستبدال النص بصورة) --- */}
      {/* لاحظ التغيير هنا: bg-gray-50 بدلاً من الأبيض */}
      <div className="relative overflow-hidden bg-gray-50 pt-24 pb-32 border-b border-gray-200">
        
        {/* زخرفة خلفية خفيفة (اختياري، يمكن إزالتها إذا أردت رمادي سادة تماماً) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <span className="bg-white text-emerald-700 px-6 py-2 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
              مقرأة إلكترونية بمنهجية أصيلة
            </span>
          </div>
          
          {/* --- هنا مكان صورة الآية الكريمة --- */}
          {/* استبدل الرابط في src بالصورة التي لديك */}
          <div className="mb-10 flex justify-center items-center">
  <img 
    src="/assets/images/quran-ayah.svg" 
    alt="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
    className="h-24 md:h-36 w-auto object-contain drop-shadow-sm select-none" 
  />
</div>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
            بيئة قرآنية تعينك على ضبط الحفظ ومراجعته، وفق رواية ورش عن نافع،
            مع العناية بالمتون العلمية والتوجيه التربوي.
          </p>
          
          {!isLoggedIn && (
            <div className="flex justify-center">
              <Link to="/register" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-emerald-700 transition-all flex items-center gap-2">
                <Heart className="w-5 h-5" fill="currentColor" />
                انضم لركب الحفاظ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- 3. قسم المنهجية (خلفية بيضاء) --- */}
      <div className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">منهجية الكُتّاب</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all group">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                <BookOpen size={40} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">رواية ورش عن نافع</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                نعتمد في التحفيظ والتسميع رواية ورش من طريق الأزرق، مع العناية بأصول الرواية وتحريراتها.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all group">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                <CheckCircle2 size={40} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">مرونة في الحفظ</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                لا نلزمك بمقدار محدد؛ يمكنك الحفظ بالثمن، الربع، أو الحزب حسب طاقتك ووقتك.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all group">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                <Users size={40} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">صحبة القرآن</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                دروس أسبوعية في التفسير والمتون العلمية (كالدرر اللوامع) لربط الحفظ بالفهم والعمل.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. برنامج الدروس (خلفية بيضاء أيضاً لزيادة التركيز على المحتوى) --- */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">برنامج الدروس الأسبوعي</h2>
            <p className="text-gray-500 font-medium text-lg">مجالس علمية عامة في رحاب الكتاب</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {lessons.length > 0 ? lessons.map((lesson) => (
              <div key={lesson.id} className="bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-8">
                  <span className="bg-emerald-100 text-emerald-800 px-5 py-2 rounded-xl text-sm font-bold">
                    {lesson.day_of_week}
                  </span>
                  <Calendar className="w-7 h-7 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 min-h-[3.5rem] leading-snug">{lesson.lesson_title}</h3>
                <div className="flex items-center gap-3 text-gray-600 font-medium border-t border-gray-200 pt-6">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>{lesson.time_description}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 col-span-3 text-center py-12 text-lg">جاري تحديث الجدول...</p>
            )}
          </div>
        </div>
      </div>

      {/* --- 5. حلقات الأطفال (خلفية خضراء) --- */}
      <div className="py-20 bg-emerald-900 text-white overflow-hidden relative">
        {/* زخرفة خلفية */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-extrabold mb-6">حلقات التحفيظ للأطفال والناشئة</h2>
          <p className="text-emerald-100 mb-12 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
            نولي عناية خاصة بالنشء لغرس حب القرآن في قلوبهم. تتوفر حلقات خاصة للأطفال بإشراف مباشر في جو آمن ومحفز.
          </p>
          
          <div className="inline-flex flex-col md:flex-row items-center gap-8 bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-2xl">
            <div className="text-center md:text-right">
              <p className="text-emerald-200 text-lg font-bold mb-3">للاستفسار والتسجيل في حلقات الأطفال</p>
              <p className="text-white text-2xl font-extrabold">تواصل مباشرة مع الشيخ المشرف</p>
            </div>
            <div className="h-16 w-px bg-white/20 hidden md:block"></div>
            <a href="tel:+212000000000" className="flex items-center gap-4 bg-white text-emerald-900 px-10 py-5 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl group">
              <Phone size={28} className="group-hover:scale-110 transition-transform" />
              <span dir="ltr" className="text-xl">+212 6 00 00 00 00</span>
            </a>
          </div>
        </div>
      </div>

      {/* التذييل */}
      <footer className="bg-gray-100 border-t border-gray-200 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6 opacity-80">
          <div className="w-8 h-8 bg-gray-400 rounded-xl flex items-center justify-center text-white font-bold">
            ح
          </div>
          <span className="font-bold text-gray-600 text-lg">كُتّاب أبي عمرو الداني</span>
        </div>
        <p className="text-gray-500 font-medium">© {new Date().getFullYear()} جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}