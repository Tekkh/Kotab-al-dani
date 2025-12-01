from django.core.management.base import BaseCommand
from library.models import TajweedLesson

class Command(BaseCommand):
    help = 'Seeds Tajweed lessons from the provided HTML content'

    def handle(self, *args, **options):
        # قائمة الدروس المستخرجة من ملفك
        lessons_data = [
            {
                "title": "أحكام النون الساكنة والتنوين",
                "order": 1,
                "content": """
                <h3>1 - الإظهار</h3>
                <p><span class="font-bold">تعريفه:</span> لفظ النون الساكنة أو التنوين من مخرجها الطبيعي عندما تلتقي بأحد أحرف الإظهار من غير غنة ولا تشديد.</p>
                <div class="bg-yellow-50 p-3 border border-yellow-200 rounded-lg my-2 text-center">
                    حروفه خمسة أحرف: (الهمزة، الهاء، العين، الغين، الحاء، الخاء)<br>
                    <span class="text-red-600 font-amiri text-lg">مجموعة في: (أخي هاك علماً حازه غير خاسر)</span>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg mt-2">
                    <h4 class="font-bold text-emerald-800 mb-1">أمثلة على الإظهار:</h4>
                    <ul class="list-disc list-inside space-y-1">
                        <li><span class="font-amiri text-lg">جنَّاتٍ ألفافاً</span>: جاء تنوين وبعده حرف (الهمزة).</li>
                        <li><span class="font-amiri text-lg">ينهون</span>: جاءت نون ساكنة وبعدها حرف (الهاء).</li>
                        <li><span class="font-amiri text-lg">من خير</span>: جاءت نون ساكنة وبعدها حرف (الخاء).</li>
                    </ul>
                </div>

                <h3>2 - الإدغام</h3>
                <p><span class="font-bold">تعريفه:</span> أن يلتقي حرف النون الساكنة أو التنوين مع أحد أحرف الإدغام فيصبحا حرفاً واحداً مشدّداً.</p>
                <div class="bg-yellow-50 p-3 border border-yellow-200 rounded-lg my-2 text-center">
                    حروفه ستة أحرف مجموعة في كلمة: <span class="text-red-600 font-amiri text-lg">(يرملون)</span>
                </div>
                <p><strong>وهو نوعان:</strong> إدغام ناقص (بغنة) في (يومن)، وإدغام كامل (بلا غنة) في (ل، ر).</p>

                <h3>3 - الإقلاب</h3>
                <p>قلب النون الساكنة أو التنوين ميماً عند الباء.</p>

                <h3>4 - الإخفاء</h3>
                <p>النطق بالنون الساكنة بصفة بين الإظهار والإدغام مع بقاء الغنة.</p>
                """
            },
            {
                "title": "أحكام الميم الساكنة",
                "order": 2,
                "content": """
                <p class="font-bold mb-2">قاعدة: الميم تدغم بمثلها وتخفى عند الباء وتظهر عند باقي الحروف.</p>
                <ul class="list-disc list-inside space-y-2">
                    <li><strong>الإدغام الشفوي:</strong> ميم ساكنة بعدها ميم متحركة. (مثال: <span class="font-amiri">لهم ما</span>).</li>
                    <li><strong>الإخفاء الشفوي:</strong> ميم ساكنة بعدها باء. (مثال: <span class="font-amiri">وهم بالآخرة</span>).</li>
                    <li><strong>الإظهار الشفوي:</strong> ميم ساكنة بعدها أي حرف آخر. (مثال: <span class="font-amiri">لهم فيها</span>).</li>
                </ul>
                """
            },
            {
                "title": "أحكام القلقلة",
                "order": 3,
                "content": """
                <p><span class="font-bold">تعريفها:</span> اضطراب في المخرج عند النطق بالحرف الساكن.</p>
                <div class="bg-yellow-50 p-3 border border-yellow-200 rounded-lg my-2 text-center">
                    حروف القلقلة: (ق، ط، ب، ج، د) <br>
                    <span class="text-red-600 font-amiri text-lg">مجموعة في: (قطب جد)</span>
                </div>
                <ul class="list-disc list-inside space-y-1">
                    <li><strong>قلقلة صغرى:</strong> في وسط الكلمة (مثل: <span class="font-amiri">يَطْمع</span>).</li>
                    <li><strong>قلقلة كبرى:</strong> عند الوقف (مثل: <span class="font-amiri">الفلق</span>).</li>
                </ul>
                """
            },
            {
                "title": "أحكام الراء (التفخيم والترقيق)",
                "order": 4,
                "content": """
                <p>الراء تفخم وترقق حسب حركتها:</p>
                <ul class="list-disc list-inside space-y-2">
                    <li><strong>التفخيم:</strong> إذا كانت مفتوحة أو مضمومة (مثل: <span class="font-amiri">رَبنا، رُزقنا</span>).</li>
                    <li><strong>الترقيق:</strong> إذا كانت مكسورة (مثل: <span class="font-amiri">رِزقاً</span>).</li>
                </ul>
                <p class="mt-2 text-sm text-gray-500">هناك حالات تفصيلية للراء الساكنة تعتمد على ما قبلها.</p>
                """
            },
            {
                "title": "باب المدود",
                "order": 5,
                "content": """
                <p><span class="font-bold">المد:</span> إطالة الصوت بحرف المد.</p>
                <div class="space-y-3 mt-2">
                    <div>
                        <strong>1. المد الطبيعي:</strong> لا يتوقف على سبب (همز أو سكون). يمد حركتين. (مثل: <span class="font-amiri">قال، قيل</span>).
                    </div>
                    <div>
                        <strong>2. المد المتصل:</strong> حرف مد وهمزة في كلمة واحدة. يمد 4-5 حركات. (مثل: <span class="font-amiri">السماء</span>).
                    </div>
                    <div>
                        <strong>3. المد المنفصل:</strong> حرف المد في كلمة والهمزة في أخرى. (مثل: <span class="font-amiri">يا أيها</span>).
                    </div>
                    <div>
                        <strong>4. المد اللازم:</strong> حرف مد وبعده سكون أصلي. يمد 6 حركات لزوماً. (مثل: <span class="font-amiri">الضالين</span>).
                    </div>
                </div>
                """
            },
            {
                "title": "علامات الوقف",
                "order": 6,
                "content": """
                <ul class="grid grid-cols-2 gap-2">
                    <li><strong>مـ:</strong> وقف لازم.</li>
                    <li><strong>لا:</strong> ممنوع الوقف.</li>
                    <li><strong>ج:</strong> وقف جائز.</li>
                    <li><strong>صلى:</strong> الوصل أولى.</li>
                    <li><strong>قلى:</strong> الوقف أولى.</li>
                    <li><strong>... ...:</strong> تعانق الوقف (قف على أحدهما).</li>
                </ul>
                """
            }
        ]

        self.stdout.write("بدء إدخال دروس التجويد...")
        
        # حذف القديم لتجنب التكرار أثناء التطوير
        TajweedLesson.objects.all().delete()
        
        for lesson in lessons_data:
            TajweedLesson.objects.create(**lesson)
        
        self.stdout.write(self.style.SUCCESS(f"تم إضافة {len(lessons_data)} درس تجويد بنجاح!"))