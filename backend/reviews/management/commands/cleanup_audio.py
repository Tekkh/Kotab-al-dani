from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from reviews.models import RecitationSubmission
import os

class Command(BaseCommand):
    help = 'حذف التلاوات والملفات الصوتية التي مر عليها أكثر من 30 يوماً'

    def handle(self, *args, **kwargs):
        # 1. تحديد تاريخ الحذف (قبل 30 يوماً من الآن)
        cutoff_date = timezone.now() - timedelta(days=30)
        
        # 2. جلب التلاوات القديمة
        old_submissions = RecitationSubmission.objects.filter(created_at__lt=cutoff_date)
        
        count = old_submissions.count()
        
        if count == 0:
            self.stdout.write(self.style.SUCCESS('لا توجد تلاوات قديمة للحذف.'))
            return

        # 3. الحذف (سيقوم جانغو بحذف الملفات المرتبطة إذا كانت الإعدادات صحيحة، ولكن للتأكد نحذف يدوياً أحياناً)
        # ملاحظة: يفضل استخدام مكتبة مثل django-cleanup لضمان حذف الملفات من النظام، 
        # لكن هنا سنعتمد على الحذف الافتراضي للريكورد.
        
        for sub in old_submissions:
            # حذف ملف الطالب
            if sub.audio_file:
                try:
                    if os.path.isfile(sub.audio_file.path):
                        os.remove(sub.audio_file.path)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'فشل حذف ملف: {e}'))

            # حذف ملف المشرف
            if sub.instructor_audio:
                try:
                    if os.path.isfile(sub.instructor_audio.path):
                        os.remove(sub.instructor_audio.path)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'فشل حذف رد: {e}'))
            
            # حذف السجل من قاعدة البيانات
            sub.delete()

        self.stdout.write(self.style.SUCCESS(f'تم حذف {count} تلاوة قديمة وملفاتها بنجاح.'))