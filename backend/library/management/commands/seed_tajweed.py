from django.core.management.base import BaseCommand
from library.models import TajweedLesson

class Command(BaseCommand):
    help = 'Seeds full Tajweed lessons from the source HTML content'

    def handle(self, *args, **options):
        lessons_data = [
            {
                "title": "أحكام النون الساكنة والتنوين",
                "order": 1,
                "content": """
                <h3 class="text-xl font-bold text-emerald-700 mt-4 mb-2">1 - الإظهار</h3>
                <p class="mb-2"><span class="font-bold text-gray-700">تعريفه:</span> لفظ النون الساكنة أو التنوين من مخرجها الطبيعي عندما تلتقي بأحد أحرف الإظهار من غير غنة ولا تشديد.</p>
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 my-4 text-center">
                    حروفه خمسة أحرف: (الهمزة، الهاء، العين، الغين، الحاء، الخاء)<br>
                    <span class="text-red-600 font-bold text-lg mt-2 block">مجموعة في: (أخي هاك علماً حازه غير خاسر)</span>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg my-4 border border-gray-100">
                    <h4 class="font-bold text-emerald-800 mb-2">أمثلة على الإظهار:</h4>
                    <ul class="list-disc list-inside space-y-2 text-gray-700">
                        <li><span class="font-amiri text-xl text-black">جنَّاتٍ ألفافاً</span>: جاء تنوين وبعده حرف (الهمزة).</li>
                        <li><span class="font-amiri text-xl text-black">ينهون</span>: جاءت نون ساكنة وبعدها حرف (الهاء).</li>
                        <li><span class="font-amiri text-xl text-black">الأنعام</span>: جاءت نون ساكنة وبعدها حرف (العين).</li>
                        <li><span class="font-amiri text-xl text-black">عفو غفور</span>: جاء تنوين وبعده حرف (الغين).</li>
                        <li><span class="font-amiri text-xl text-black">عطاءً حساباً</span>: جاء تنوين وبعده حرف (الحاء).</li>
                        <li><span class="font-amiri text-xl text-black">من خير</span>: جاءت نون ساكنة وبعدها حرف (الخاء).</li>
                    </ul>
                </div>

                <h3 class="text-xl font-bold text-emerald-700 mt-6 mb-2">2 - الإدغام</h3>
                <p class="mb-2"><span class="font-bold text-gray-700">تعريفه:</span> أن يلتقي حرف النون الساكنة أو التنوين مع أحد أحرف الإدغام فيصبحا حرفاً واحداً مشدّداً.</p>
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 my-4 text-center">
                    حروفه ستة أحرف مجموعة في كلمة: <span class="text-red-600 font-bold text-lg">(يرملون)</span>
                </div>
                <p class="font-bold mb-2">وهو نوعان:</p>
                
                <div class="ml-4 mb-4 pl-4 border-r-4 border-emerald-200">
                    <h4 class="font-bold text-gray-800">أ. الإدغام الناقص (بغنة):</h4>
                    <p>إدغام النون الساكنة أو التنوين بحرف من أحرف الإدغام الناقص مع إظهار الغنة.</p>
                    <div class="bg-white p-2 border border-gray-200 rounded mt-2 text-sm">
                        حروفه أربعة: (الياء، الواو، الميم، النون) مجموعة في: <span class="text-red-600 font-bold">(يومن)</span>
                    </div>
                    <div class="bg-gray-50 p-3 rounded mt-2">
                        <ul class="list-disc list-inside space-y-1">
                            <li><span class="font-amiri text-lg">فمن يعمل</span>: نون ساكنة بعدها (ياء).</li>
                            <li><span class="font-amiri text-lg">من ولي</span>: نون ساكنة بعدها (واو).</li>
                            <li><span class="font-amiri text-lg">سراجاً منيرا</span>: تنوين وبعده (ميم).</li>
                            <li><span class="font-amiri text-lg">يومئذ ناعمة</span>: تنوين وبعده (نون).</li>
                        </ul>
                    </div>
                </div>

                <div class="ml-4 mb-4 pl-4 border-r-4 border-emerald-200">
                    <h4 class="font-bold text-gray-800">ب. الإدغام الكامل (بلا غنة):</h4>
                    <p>إدغام النون الساكنة أو التنوين بحرف من أحرف الإدغام الكامل من غير إظهار الغنة.</p>
                    <div class="bg-white p-2 border border-gray-200 rounded mt-2 text-sm">
                        حروفه حرفان وهما: (اللام والراء)
                    </div>
                    <div class="bg-gray-50 p-3 rounded mt-2">
                        <ul class="list-disc list-inside space-y-1">
                            <li><span class="font-amiri text-lg">من لدنا</span>: نون ساكنة بعدها (لام).</li>
                            <li><span class="font-amiri text-lg">غفور رحيم</span>: تنوين وبعده (راء).</li>
                        </ul>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-emerald-700 mt-6 mb-2">3 - الإقلاب</h3>
                <p class="mb-2"><span class="font-bold text-gray-700">تعريفه:</span> هو قلب (تحويل) النون إلى ميم.</p>
                <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center font-bold">
                    حروفه حرف واحد وهو: (الباء)
                </div>
                <div class="bg-gray-50 p-4 rounded-lg my-4 border border-gray-100">
                    <h4 class="font-bold text-emerald-800 mb-2">أمثلة على الإقلاب:</h4>
                    <ul class="list-disc list-inside space-y-1">
                        <li><span class="font-amiri text-xl">من بعد</span>: نون ساكنة بعدها باء.</li>
                        <li><span class="font-amiri text-xl">عليم بذات</span>: تنوين وبعده باء.</li>
                    </ul>
                </div>

                <h3 class="text-xl font-bold text-emerald-700 mt-6 mb-2">4 - الإخفاء</h3>
                <p class="mb-2"><span class="font-bold text-gray-700">تعريفه:</span> هو النطق بالنون الساكنة أو التنوين بإخفاء النون مع الإبقاء على الغنة فقط ومن غير تشديد.</p>
                <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
                    حروفه: كل الحروف باستثناء حروف الإظهار والإدغام والإقلاب وعددها 15 حرفاً.
                </div>
                <div class="bg-gray-50 p-4 rounded-lg my-4 border border-gray-100">
                    <h4 class="font-bold text-emerald-800 mb-2">أمثلة مختارة على الإخفاء:</h4>
                    <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li><span class="font-amiri text-lg">فانصب</span>: (الصاد).</li>
                        <li><span class="font-amiri text-lg">منضود</span>: (الضاد).</li>
                        <li><span class="font-amiri text-lg">ماء دافق</span>: (الدال).</li>
                        <li><span class="font-amiri text-lg">من ذا</span>: (الذال).</li>
                        <li><span class="font-amiri text-lg">كنتم</span>: (التاء).</li>
                        <li><span class="font-amiri text-lg">أن سيكون</span>: (السين).</li>
                        <li><span class="font-amiri text-lg">من طين</span>: (الطاء).</li>
                        <li><span class="font-amiri text-lg">فانظر</span>: (الظاء).</li>
                    </ul>
                </div>
                """
            },
            {
                "title": "أحكام الميم الساكنة",
                "order": 2,
                "content": """
                <p class="font-bold text-gray-700 mb-4 bg-blue-50 p-3 rounded border border-blue-100 text-center">
                    قاعدة: الميم تدغم بمثلها وتخفى عند الباء وتظهر عند باقي الحروف.
                </p>

                <h3 class="text-lg font-bold text-emerald-700 mt-4 mb-1">1 - الإدغام الشفوي</h3>
                <p>تأتي ميم ساكنة وبعدها ميم متحركة.</p>
                <div class="bg-white border border-gray-200 p-2 rounded my-2 text-sm inline-block">حروفه: (الميم)</div>
                <div class="bg-gray-50 p-2 rounded border-r-4 border-emerald-400">
                    مثال: <span class="font-amiri text-lg">لهم ما</span>.
                </div>

                <h3 class="text-lg font-bold text-emerald-700 mt-6 mb-1">2 - الإخفاء الشفوي</h3>
                <p>تأتي ميم ساكنة وبعدها باء.</p>
                <div class="bg-white border border-gray-200 p-2 rounded my-2 text-sm inline-block">حروفه: (الباء)</div>
                <div class="bg-gray-50 p-2 rounded border-r-4 border-emerald-400">
                    مثال: <span class="font-amiri text-lg">وهم بالآخرة</span>.
                </div>

                <h3 class="text-lg font-bold text-emerald-700 mt-6 mb-1">3 - الإظهار الشفوي</h3>
                <p>تأتي ميم ساكنة وبعدها أي حرف باستثناء الميم والباء.</p>
                <div class="bg-white border border-gray-200 p-2 rounded my-2 text-sm inline-block">حروفه: كل الحروف إلا الميم والباء.</div>
                <div class="bg-gray-50 p-3 rounded border-r-4 border-emerald-400 mt-2">
                    <ul class="list-disc list-inside space-y-1">
                        <li><span class="font-amiri text-lg">مثلهم كمثل</span>.</li>
                        <li><span class="font-amiri text-lg">لهم فيها</span>.</li>
                        <li><span class="font-amiri text-lg">أم حسبتم</span>.</li>
                    </ul>
                </div>
                """
            },
            {
                "title": "أحكام القلقلة",
                "order": 3,
                "content": """
                <p class="mb-2"><span class="font-bold text-gray-700">تعريفها:</span> اضطراب في المخرج يؤدّي إلى قلقلة أحد حروفها عندما يكون هذا الحرف ساكناً.</p>
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 my-4 text-center">
                    حروف القلقلة خمسة: (القاف، الطاء، الباء، الجيم، الدال)<br>
                    <span class="text-red-600 font-bold text-lg mt-2 block">مجموعة في كلمة: (قطب جد)</span>
                </div>

                <h3 class="text-xl font-bold text-emerald-700 mt-4 mb-2">أنواع القلقلة:</h3>
                
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 class="font-bold text-gray-800 mb-2">1 - قلقلة صغرى</h4>
                        <p class="mb-2 text-sm">يأتي حرف القلقلة ساكناً في وسط الكلمة فيُقلقل.</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li><span class="font-amiri text-lg">خلقنا</span> (قاف ساكنة وسط الكلمة).</li>
                            <li><span class="font-amiri text-lg">ربطنا</span> (طاء ساكنة).</li>
                            <li><span class="font-amiri text-lg">إبراهيم</span> (باء ساكنة).</li>
                            <li><span class="font-amiri text-lg">أجراً</span> (جيم ساكنة).</li>
                            <li><span class="font-amiri text-lg">ادخلوا</span> (دال ساكنة).</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 class="font-bold text-gray-800 mb-2">2 - قلقلة كبرى</h4>
                        <p class="mb-2 text-sm">نقف عند حرف القلقلة فنجعله ساكناً ونقلقله.</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li><span class="font-amiri text-lg">الفلق</span> (وقفنا عند القاف).</li>
                            <li><span class="font-amiri text-lg">سواء الصراط</span> (وقفنا عند الطاء).</li>
                            <li><span class="font-amiri text-lg">وما كسب</span> (وقفنا عند الباء).</li>
                            <li><span class="font-amiri text-lg">في الحج</span> (وقفنا عند الجيم).</li>
                            <li><span class="font-amiri text-lg">الله الصمد</span> (وقفنا عند الدال).</li>
                        </ul>
                    </div>
                </div>
                """
            },
            {
                "title": "أحكام الراء (التفخيم والترقيق)",
                "order": 4,
                "content": """
                <p class="mb-4">حرف الراء يفخّم ويرقق على حسب حركته إذا كان متحركاً، وعلى حسب حركة الحرف الذي قبله إذا كان ساكناً.</p>

                <div class="mb-6">
                    <h3 class="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-3">أولاً: إذا كانت الراء متحركة</h3>
                    <ul class="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-lg">
                        <li><strong>تفخم:</strong> إذا كانت مضمومة أو مفتوحة. (مثال: <span class="font-amiri text-lg">البر، الرحمن، رَبِّي</span>).</li>
                        <li><strong>ترقق:</strong> إذا كانت مكسورة. (مثال: <span class="font-amiri text-lg">رزقاً، القارعة</span>).</li>
                    </ul>
                </div>

                <div class="mb-6">
                    <h3 class="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-3">ثانياً: إذا كانت الراء ساكنة</h3>
                    
                    <div class="mb-4">
                        <h4 class="font-bold text-gray-800 mb-2">أ. تفخم في الحالات التالية:</h4>
                        <ul class="list-disc list-inside space-y-1 text-sm text-gray-700 pl-4">
                            <li>إذا سبقها حرف مفتوح أو ألف ساكنة.</li>
                            <li>إذا سبقها حرف مضموم أو واو ساكنة.</li>
                            <li class="bg-emerald-50 p-2 rounded border border-emerald-100 my-1">أمثلة: <span class="font-amiri text-lg">فارتقب، الأمور، بالمرحمة، قُرْآناً</span>.</li>
                            <li>إذا سبقها كسر عارض (أمثلة: <span class="font-amiri text-lg">ارجعوا، ارجعي</span>).</li>
                            <li>إذا سبقها كسر أصلي وبعدها حرف استعلاء غير مكسور في كلمة واحدة (أمثلة: <span class="font-amiri text-lg">مرصادا، قرطاس، فرقة</span>).</li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-bold text-gray-800 mb-2">ب. ترقق في الحالات التالية:</h4>
                        <ul class="list-disc list-inside space-y-1 text-sm text-gray-700 pl-4">
                            <li>إذا سبقت بحرف مكسور أو ياء ساكنة.</li>
                            <li class="bg-emerald-50 p-2 rounded border border-emerald-100 my-1">أمثلة: <span class="font-amiri text-lg">فرعون، فردوس، مصير</span>.</li>
                        </ul>
                    </div>
                </div>
                """
            },
            {
                "title": "أحكام اللام في لفظ الجلالة",
                "order": 5,
                "content": """
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg border-t-4 border-emerald-500 shadow-sm">
                        <h3 class="font-bold text-lg mb-2 text-gray-800">تفخيم اللام</h3>
                        <p class="text-sm mb-2">إذا سبق لفظ الجلالة حرف مضموم أو واو ساكنة / حرف مفتوح أو ألف ساكنة.</p>
                        <ul class="list-disc list-inside text-sm space-y-1">
                            <li><span class="font-amiri text-lg">والله، تالله</span> (سبقه حرف قسم مفتوح).</li>
                            <li><span class="font-amiri text-lg">شهد الله، إلى الله، ملاقو الله</span>.</li>
                        </ul>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg border-t-4 border-blue-500 shadow-sm">
                        <h3 class="font-bold text-lg mb-2 text-gray-800">ترقيق اللام</h3>
                        <p class="text-sm mb-2">إذا سبق لفظ الجلالة حرف مكسور أو ياء ساكنة.</p>
                        <ul class="list-disc list-inside text-sm space-y-1">
                            <li><span class="font-amiri text-lg">بالله، لله</span>.</li>
                            <li><span class="font-amiri text-lg">بسم الله، قل الله، يهدي الله</span>.</li>
                        </ul>
                    </div>
                </div>
                """
            },
            {
                "title": "باب المدود",
                "order": 6,
                "content": """
                <p class="mb-4"><span class="font-bold text-gray-700">المد:</span> إطالة الصوت في أحد حروف المد (الألف، الواو، الياء) الساكنة.</p>

                <div class="space-y-4">
                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">1 - المد الطبيعي</h4>
                        <p class="text-sm">أن تأتي ألف ساكنة وقبلها مفتوح، واو ساكنة وقبلها مضموم، ياء ساكنة وقبلها مكسور. (مقدار مده: حركتين).</p>
                        <div class="bg-gray-50 p-2 mt-1 rounded text-sm">أمثلة: <span class="font-amiri text-lg">زادكم، قَالُوْا، دينهم</span>.</div>
                    </div>

                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">2 - المد المتصل</h4>
                        <p class="text-sm">أن يأتي حرف المد وبعده همزة في كلمة واحدة. (مقدار مده: 4-5 حركات).</p>
                        <div class="bg-gray-50 p-2 mt-1 rounded text-sm">أمثلة: <span class="font-amiri text-lg">الصائمين، سُوْء، هنيئاً</span>.</div>
                    </div>

                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">3 - المد المنفصل</h4>
                        <p class="text-sm">أن يأتي حرف المد في آخر الكلمة ويأتي بعده همزة في أول الكلمة التالية. (مقدار مده: 2/4/6 حركات).</p>
                        <div class="bg-gray-50 p-2 mt-1 rounded text-sm">أمثلة: <span class="font-amiri text-lg">بما أنزل، جعلوا أصابعهم، في أموالهم</span>.</div>
                    </div>

                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">4 - مد البدل</h4>
                        <p class="text-sm">أصله همزة متحركة وبعدها همزة ساكنة أبدلت حرف مد مجانس لحركة الأولى. (مقدار مده: حركتين).</p>
                        <div class="bg-gray-50 p-2 mt-1 rounded text-sm">أمثلة: <span class="font-amiri text-lg">إيماناً</span> (أصلها إِأْماناً)، <span class="font-amiri text-lg">آمن</span> (أصلها أَأْمن).</div>
                    </div>

                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">5 - المد العارض للسكون</h4>
                        <p class="text-sm">أن يأتي حرف المد وبعده حرف ساكن بسكون عارض بسبب الوقف. (مقدار مده: 2/4/6 حركات).</p>
                        <div class="bg-gray-50 p-2 mt-1 rounded text-sm">أمثلة: <span class="font-amiri text-lg">الأوتاد، يفعلون</span> (عند الوقف).</div>
                    </div>

                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">6 - مد العوض</h4>
                        <p class="text-sm">الوقف على تنوين الفتح بالألف الممدودة عوضاً عن التنوين. (مقدار مده: حركتين).</p>
                        <div class="bg-gray-50 p-2 mt-1 rounded text-sm">أمثلة: <span class="font-amiri text-lg">غفوراً رحيما، مهادا</span>.</div>
                    </div>

                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">7 - مد الصلة</h4>
                        <p class="text-sm">هاء الضمير المتصل المتحركة الواقعة بين متحركين.</p>
                        <ul class="list-disc list-inside text-sm mt-1 pl-4">
                            <li><strong>صلة كبرى:</strong> إذا جاء بعدها همزة (تمد 2/4/6). مثال: <span class="font-amiri text-lg">عندَهُ إِلَّا</span>.</li>
                            <li><strong>صلة صغرى:</strong> إذا جاء بعدها غير الهمزة (تمد حركتين). مثال: <span class="font-amiri text-lg">إِنَّهُ لَقرآن</span>.</li>
                        </ul>
                    </div>

                    <div class="border-b border-gray-100 pb-2">
                        <h4 class="font-bold text-emerald-800">8 - المد اللازم</h4>
                        <p class="text-sm">أن يأتي حرف المد وبعده حرف ساكن بسكون أصلي (سكون أو شدة). (مقدار مده: 6 حركات).</p>
                        <div class="grid grid-cols-2 gap-2 text-xs mt-2">
                            <div class="bg-gray-50 p-2 rounded"><strong>كلمي مثقل:</strong> <span class="font-amiri text-lg">الضَّالِّين</span></div>
                            <div class="bg-gray-50 p-2 rounded"><strong>كلمي مخفف:</strong> <span class="font-amiri text-lg">الآن</span></div>
                            <div class="bg-gray-50 p-2 rounded"><strong>حرفي مثقل:</strong> اللام في <span class="font-amiri text-lg">الم</span></div>
                            <div class="bg-gray-50 p-2 rounded"><strong>حرفي مخفف:</strong> الميم في <span class="font-amiri text-lg">الم</span></div>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-bold text-emerald-800">9 - مد اللين</h4>
                        <p class="text-sm">الياء أو الواو الساكنة المفتوح ما قبلها. (مقدار مده: 2/4/6 عند الوقف).</p>
                        <div class="bg-gray-50 p-2 mt-1 rounded text-sm">أمثلة: <span class="font-amiri text-lg">قريش، الصَّيْف، البيت</span>.</div>
                    </div>
                </div>
                """
            },
            {
                "title": "علامات الوقف",
                "order": 7,
                "content": """
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div class="bg-gray-50 p-3 rounded border border-gray-100"><strong class="text-lg text-emerald-700">صلى</strong>: الوقف جائز ولكن الأولى أن نكمل القراءة.</div>
                    <div class="bg-gray-50 p-3 rounded border border-gray-100"><strong class="text-lg text-emerald-700">قلى</strong>: الوقف جائز والأولى أن نقف.</div>
                    <div class="bg-gray-50 p-3 rounded border border-gray-100"><strong class="text-lg text-emerald-700">ج</strong>: الوقف جائز (مخيرون).</div>
                    <div class="bg-gray-50 p-3 rounded border border-gray-100"><strong class="text-lg text-emerald-700">س</strong>: وجوب سكتة قصيرة (حركتين) دون تنفس.</div>
                    <div class="bg-red-50 p-3 rounded border border-red-100"><strong class="text-lg text-red-700">لا</strong>: النهي عن الوقف.</div>
                    <div class="bg-red-50 p-3 rounded border border-red-100"><strong class="text-lg text-red-700">مـ</strong>: لزوم الوقف (الوصل ممنوع).</div>
                    <div class="bg-gray-50 p-3 rounded border border-gray-100 col-span-full"><strong class="text-lg text-emerald-700">... ...</strong>: تعانق الوقف، وقف في أحد الموضعين وليس كليهما.</div>
                </div>
                """
            },
            {
                "title": "الهمس",
                "order": 8,
                "content": """
                <p class="mb-2"><span class="font-bold text-gray-700">تعريفه:</span> جريان النفس عند النطق بحرف من حروفه إذا كان ساكناً.</p>
                <div class="bg-yellow-50 p-3 border border-yellow-200 rounded-lg my-2 text-center">
                    حروفه عشرة مجموعة في: <span class="text-red-600 font-bold text-lg">(فحثه شخص سكت)</span>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg mt-2">
                    أمثلة: <span class="font-amiri text-xl">يفقهوا، واحلل، أَهْلي، كَذَّبَتْ، اسكن</span>.
                </div>
                """
            },
            {
                "title": "الإدغام بحسب الصفات",
                "order": 9,
                "content": """
                <div class="space-y-4">
                    <div class="border-l-4 border-emerald-500 pl-4 ml-2">
                        <h3 class="font-bold text-gray-800">1 - الإدغام المتماثل</h3>
                        <p class="text-sm">إدغام حرف ساكن بحرف متحرك مماثل له.</p>
                        <div class="text-sm text-gray-600 mt-1">أمثلة: <span class="font-amiri text-lg">يُكرهُهُنَّ</span> (تلفظ يُكرهن)، <span class="font-amiri text-lg">ربحت تجارتهم</span>.</div>
                    </div>

                    <div class="border-l-4 border-blue-500 pl-4 ml-2">
                        <h3 class="font-bold text-gray-800">2 - الإدغام المتجانس</h3>
                        <p class="text-sm">إدغام حرف ساكن بحرف يجانسه في المخرج.</p>
                        <ul class="list-disc list-inside text-sm mt-1 space-y-1">
                            <li>مخرج (ط، ت، د): <span class="font-amiri text-lg">قَدْ تَبِينَ، بسطت</span>.</li>
                            <li>مخرج (ظ، ذ، ث): <span class="font-amiri text-lg">إذ ظلمتم، يلهث ذلك</span>.</li>
                            <li>مخرج (م، ب): <span class="font-amiri text-lg">اركب معنا</span>.</li>
                        </ul>
                    </div>

                    <div class="border-l-4 border-purple-500 pl-4 ml-2">
                        <h3 class="font-bold text-gray-800">3 - الإدغام المتقارب</h3>
                        <p class="text-sm">إدغام حرف ساكن بحرف يقاربه في المخرج والصفة.</p>
                        <ul class="list-disc list-inside text-sm mt-1 space-y-1">
                            <li>اللام في الراء: <span class="font-amiri text-lg">وقُلْ رَبِّ</span> (تلفظ وقرَّب).</li>
                            <li>القاف في الكاف: <span class="font-amiri text-lg">نخلقكم</span> (تلفظ نخلكم).</li>
                        </ul>
                    </div>
                </div>
                """
            },
            {
                "title": "اللحن (الخطأ)",
                "order": 10,
                "content": """
                <ul class="space-y-3">
                    <li class="bg-red-50 p-3 rounded border border-red-100">
                        <strong>اللحن الجلي:</strong> الخطأ الظاهر الذي يغير المعنى (تغيير الحركات أو الحروف). <br>
                        <span class="text-red-600 font-bold text-sm">حكمه: لا يجوز ويبطل الصلاة في الفاتحة.</span>
                    </li>
                    <li class="bg-orange-50 p-3 rounded border border-orange-100">
                        <strong>اللحن الخفي:</strong> الخطأ في أحكام التجويد (ترك الغنة، الإظهار مكان الإدغام). <br>
                        <span class="text-orange-600 font-bold text-sm">حكمه: يأثم إذا لم يتعلم.</span>
                    </li>
                </ul>
                """
            },
            {
                "title": "الألفات السبعة",
                "order": 11,
                "content": """
                <p class="mb-2">ألفات تلفظ عند الوقف وتحذف عند الوصل، وهي:</p>
                <div class="flex flex-wrap gap-2">
                    <span class="bg-gray-100 px-3 py-1 rounded font-amiri text-lg">أنا</span>
                    <span class="bg-gray-100 px-3 py-1 rounded font-amiri text-lg">لكنا</span>
                    <span class="bg-gray-100 px-3 py-1 rounded font-amiri text-lg">الظنونا</span>
                    <span class="bg-gray-100 px-3 py-1 rounded font-amiri text-lg">الرسولا</span>
                    <span class="bg-gray-100 px-3 py-1 rounded font-amiri text-lg">السبيلاً</span>
                    <span class="bg-gray-100 px-3 py-1 rounded font-amiri text-lg">قواريراً</span>
                    <span class="bg-gray-100 px-3 py-1 rounded font-amiri text-lg">سلاسلاً</span>
                </div>
                """
            },
            {
                "title": "الإشمام والروم والإظهار المطلق",
                "order": 12,
                "content": """
                <h3 class="font-bold text-gray-800 mb-2">الإشمام والروم (عند الوقف)</h3>
                <ul class="list-disc list-inside space-y-2 mb-6 bg-gray-50 p-3 rounded">
                    <li><strong>الإشمام:</strong> ضم الشفتين عند لفظ الحرف المضموم من غير صوت (يرى ولا يسمع). مثال: <span class="font-amiri text-lg">نستعين</span>.</li>
                    <li><strong>الروم:</strong> الإتيان ببعض الحركة (ثلث الحركة) في المضموم والمكسور بصوت خفي. مثال: <span class="font-amiri text-lg">نستعينُ، الرحيمِ</span>.</li>
                </ul>

                <h3 class="font-bold text-gray-800 mb-2">الإظهار المطلق</h3>
                <p class="text-sm mb-2">يحدث إذا وقعت النون الساكنة في وسط الكلمة وتلاها أحد حروف الإدغام. ورد في 4 كلمات فقط:</p>
                <div class="flex gap-4 justify-center bg-yellow-50 p-3 rounded border border-yellow-200 font-amiri text-xl">
                    <span>الدُّنْيا</span> • <span>بنيان</span> • <span>صنوان</span> • <span>قنوان</span>
                </div>
                """
            }
        ]

        self.stdout.write("بدء إدخال دروس التجويد الكاملة...")
        
        TajweedLesson.objects.all().delete()
        
        for lesson in lessons_data:
            TajweedLesson.objects.create(**lesson)
        
        self.stdout.write(self.style.SUCCESS(f"تم إضافة {len(lessons_data)} درس تجويد شامل بنجاح!"))