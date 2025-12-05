from django.db import models

class WeeklyLesson(models.Model):
    day_of_week = models.CharField(max_length=20, verbose_name="اليوم")
    time_description = models.CharField(max_length=100, verbose_name="التوقيت")
    lesson_title = models.CharField(max_length=200, verbose_name="عنوان الدرس")
    order = models.PositiveIntegerField(default=0, verbose_name="الترتيب")
    is_active = models.BooleanField(default=True, verbose_name="نشط؟")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.lesson_title

# --- [جديد] إعدادات الموقع العامة ---
class SiteSetting(models.Model):
    # الإعلان العاجل
    announcement_text = models.CharField(max_length=255, blank=True, verbose_name="نص الإعلان")
    is_announcement_active = models.BooleanField(default=False, verbose_name="تفعيل الإعلان؟")
    
    def __str__(self):
        return "إعدادات الموقع العامة"

    def save(self, *args, **kwargs):
        if not self.pk and SiteSetting.objects.exists():
            # إذا كان هناك إعداد موجود، نمنع إنشاء جديد (يجب تعديل الموجود)
            return
        return super(SiteSetting, self).save(*args, **kwargs)