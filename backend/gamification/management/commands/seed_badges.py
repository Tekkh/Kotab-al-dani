from django.core.management.base import BaseCommand
from gamification.models import Badge

class Command(BaseCommand):
    help = 'Seeds the database with the defined badges list'

    def handle(self, *args, **options):
        badges_data = [
            # --- البدايات ---
            {
                "condition_type": "first_thumn",
                "name": "بداية الغيث",
                "description": "حفظت أول ثمن لك! بداية موفقة.",
                "icon_name": "star",
                "order": 1
            },
            # --- الكمية ---
            { "condition_type": "first_hizb", "name": "رائحة الفجر", "description": "حفظت أول حزب. أول قطرة في مشوار مبارك.", "icon_name": "sunrise", "order": 10 },
            { "condition_type": "hizb_3", "name": "خطوة السائر", "description": "حفظت 3 أحزاب. الطريق بدأ يتضح.", "icon_name": "footprints", "order": 20 },
            { "condition_type": "hizb_5", "name": "همة عالية", "description": "حفظت 5 أحزاب. عزيمة تتقوى.", "icon_name": "arrow-up", "order": 30 },
            { "condition_type": "hizb_7", "name": "زاد المسافر", "description": "حفظت 7 أحزاب.", "icon_name": "backpack", "order": 40 },
            { "condition_type": "hizb_10", "name": "نَفَسُ المجتهد", "description": "حفظت 10 أحزاب.", "icon_name": "wind", "order": 50 },
            { "condition_type": "hizb_15", "name": "ربع القرآن", "description": "حفظت 15 حزباً.", "icon_name": "pie-chart", "order": 60 },
            { "condition_type": "hizb_20", "name": "عزيمة لا تلين", "description": "حفظت 20 حزباً.", "icon_name": "dumbbell", "order": 70 },
            { "condition_type": "hizb_30", "name": "نصف القرآن", "description": "حفظت 30 حزباً. على الدرب تسير.", "icon_name": "circle-half", "order": 80 },
            { "condition_type": "hizb_60", "name": "تاج الحافظ", "description": "أتممت حفظ القرآن كاملاً. هنيئاً لك.", "icon_name": "crown", "order": 100 },
            
            # --- السور والأجزاء ---
            { "condition_type": "juz_amma", "name": "نور عمّ", "description": "حفظت جزء عمّ كاملاً.", "icon_name": "sparkles", "order": 110 },
            { "condition_type": "juz_tabarak", "name": "تبارك البركة", "description": "حفظت جزء تبارك.", "icon_name": "moon", "order": 120 },
            { "condition_type": "surah_mulk", "name": "المُنجيَة", "description": "حفظت سورة الملك.", "icon_name": "castle", "order": 130 },
            { "condition_type": "surah_yasin", "name": "القلب الحيّ", "description": "حفظت سورة يس.", "icon_name": "heart", "order": 140 },
            { "condition_type": "surah_baqarah", "name": "سيدة السور", "description": "حفظت سورة البقرة.", "icon_name": "star", "order": 150 },
            { "condition_type": "surah_rahman", "name": "درر الرحمن", "description": "حفظت سورة الرحمن.", "icon_name": "gem", "order": 160 },
            { "condition_type": "surah_kahf", "name": "نور الكهف", "description": "حفظت سورة الكهف.", "icon_name": "mountain", "order": 170 },
            
            # --- المداومة ---
            { "condition_type": "streak_7", "name": "خطوة كل يوم", "description": "مداومة 7 أيام متتابعة.", "icon_name": "check-circle", "order": 200 },
            { "condition_type": "streak_30", "name": "طريق النور", "description": "مداومة 30 يوماً.", "icon_name": "calendar", "order": 210 },
            { "condition_type": "streak_100", "name": "روح المثابر", "description": "مداومة 100 يوم.", "icon_name": "fire", "order": 220 },
        ]

        self.stdout.write("بدء إدخال الأوسمة...")
        
        for badge_data in badges_data:
            Badge.objects.update_or_create(
                condition_type=badge_data['condition_type'],
                defaults=badge_data
            )
        
        self.stdout.write(self.style.SUCCESS(f"تم تحديث/إضافة {len(badges_data)} وسام بنجاح!"))