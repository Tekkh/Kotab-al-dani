import json
from django.core.management.base import BaseCommand
from progress.models import QuranStructure
from django.conf import settings # لاستيراد إعدادات المشروع

class Command(BaseCommand):
    help = 'Loads Quran structure data from JSON file into the database'

    def handle(self, *args, **options):
        # تحديد مسار ملف JSON
        data_file = settings.BASE_DIR / 'data' / 'quran_data_simplified.json'

        # التأكد من عدم تحميل البيانات مرتين (اختياري)
        if QuranStructure.objects.exists():
            self.stdout.write(self.style.WARNING('Data already loaded, skipping.'))
            return

        self.stdout.write(self.style.SUCCESS('Loading Quran data...'))

        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            for item in data:
                QuranStructure.objects.create(
                    surah_id=item['surah_id'],
                    surah_name=item['surah_name'],
                    ayah_id=item['ayah_id'],
                    ayah_text=item['ayah_text'],
                    juz=item['juz'],
                    hizb=item['hizb'],
                    rub=item['rub'],
                    thumn=item['thumn'],
                    page=item['page']
                )

            self.stdout.write(self.style.SUCCESS('Successfully loaded Quran structure data.'))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {data_file}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {e}'))