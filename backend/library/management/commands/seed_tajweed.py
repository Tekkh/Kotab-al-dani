import json
import os
from django.conf import settings
from django.core.management.base import BaseCommand
from library.models import TajweedLesson

class Command(BaseCommand):
    help = 'Seeds Tajweed lessons from JSON file'

    def handle(self, *args, **options):
        # تحديد مسار ملف JSON
        json_file_path = os.path.join(settings.BASE_DIR, 'data', 'tajweed_content.json')

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_file_path}'))
            return

        self.stdout.write("Loading Tajweed data from JSON...")

        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                lessons_data = json.load(f)

            # تنظيف البيانات القديمة لإعادة البناء
            TajweedLesson.objects.all().delete()

            for lesson in lessons_data:
                TajweedLesson.objects.create(
                    title=lesson['title'],
                    order=lesson['order'],
                    content=lesson['content']
                )

            self.stdout.write(self.style.SUCCESS(f"Successfully loaded {len(lessons_data)} lessons."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error loading data: {e}"))