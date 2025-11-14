from django.db import models

class WeeklyLesson(models.Model):
    # اليوم (مثل: "الثلاثاء", "الأحد")
    day_of_week = models.CharField(max_length=100)

    # التوقيت (مثل: "بعد العشاءين", "بعد صلاة الصبح")
    time_description = models.CharField(max_length=100)

    # عنوان الدرس (مثل: "شرح متن الدرر اللوامع...")
    lesson_title = models.CharField(max_length=255)

    # حقل إضافي للترتيب (حتى نتحكم في أي درس يظهر أولاً)
    order = models.PositiveIntegerField(default=0)

    # حقل للتحكم (هل الدرس نشط أم مخفي)
    is_active = models.BooleanField(default=True)

    class Meta:
        # ترتيب الدروس الافتراضي بناءً على الحقل 'order'
        ordering = ['order']

    def __str__(self):
        # هذا ما سيظهر في لوحة تحكم المشرف (Admin Panel)
        return f"{self.day_of_week}: {self.lesson_title}"
