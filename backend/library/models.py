from django.db import models

# 1. موديل المتون (للملفات)
class Matn(models.Model):
    title = models.CharField(max_length=200, verbose_name="اسم المتن")
    author = models.CharField(max_length=200, verbose_name="المؤلف", blank=True)
    description = models.TextField(verbose_name="وصف قصير", blank=True)
    pdf_file = models.FileField(upload_to='matoon/', verbose_name="ملف PDF")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.title

# 2. موديل أحكام التجويد
class TajweedLesson(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان الدرس")
    content = models.TextField(verbose_name="محتوى الدرس")
    order = models.PositiveIntegerField(default=0, verbose_name="الترتيب")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

# 3. موديل التفسير
class Tafsir(models.Model):
    surah_id = models.IntegerField(verbose_name="رقم السورة")
    surah_name = models.CharField(max_length=100, verbose_name="اسم السورة")
    text = models.TextField(verbose_name="نص التفسير")

    class Meta:
        ordering = ['surah_id']

    def __str__(self):
        return f"تفسير {self.surah_name}"