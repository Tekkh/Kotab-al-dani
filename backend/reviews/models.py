from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone  # استيراد دالة الوقت
import os

# دالة لتنظيم أسماء الملفات ومساراتها
def recitation_upload_path(instance, filename):
    # نستخدم timezone.now() بدلاً من instance.created_at لتجنب خطأ None
    today = timezone.now()
    # النتيجة: recitations/2024/12/15/username_filename.mp3
    return f'recitations/{today.strftime("%Y/%m/%d")}/{instance.student.username}_{filename}'

def feedback_upload_path(instance, filename):
    today = timezone.now()
    return f'feedback/{today.strftime("%Y/%m/%d")}/reply_{filename}'

class RecitationSubmission(models.Model):
    # حالات الطلب
    class Status(models.TextChoices):
        PENDING = 'pending', 'قيد الانتظار'
        IN_PROGRESS = 'in_progress', 'جاري الاستماع'
        COMPLETED = 'completed', 'تم التصحيح'
        REJECTED = 'rejected', 'مرفوض/إعادة'

    # 1. الطالب
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recitations')
    
    # 2. الملف الصوتي (التلاوة)
    audio_file = models.FileField(upload_to=recitation_upload_path, verbose_name="ملف التلاوة")
    
    # 3. السياق (ماذا يقرأ؟)
    surah_name = models.CharField(max_length=100, verbose_name="اسم السورة")
    from_ayah = models.IntegerField(verbose_name="من الآية")
    to_ayah = models.IntegerField(verbose_name="إلى الآية")
    
    # 4. الحالة
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING,
        verbose_name="حالة الطلب"
    )

    # 5. ملاحظات المشرف (Feedback)
    instructor_rating = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="التقييم (من 5)"
    )
    instructor_notes = models.TextField(null=True, blank=True, verbose_name="ملاحظات نصية")
    instructor_audio = models.FileField(
        upload_to=feedback_upload_path, 
        null=True, blank=True, 
        verbose_name="تسجيل المشرف (رد صوتي)"
    )

    # 6. التوقيت
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="وقت الإرسال")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخر تحديث")
    reviewed_at = models.DateTimeField(null=True, blank=True, verbose_name="وقت التصحيح")

    class Meta:
        ordering = ['-created_at'] # الأحدث أولاً
        # هذه الأسماء للعرض فقط في لوحة الأدمن، الجدول في قاعدة البيانات سيبقى reviews_recitationsubmission
        verbose_name = "طلب تصحيح تلاوة"
        verbose_name_plural = "طلبات تصحيح التلاوة"

    def __str__(self):
        return f"{self.student.username} - {self.surah_name} ({self.get_status_display()})"