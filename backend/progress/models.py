from django.db import models
from django.contrib.auth.models import User

# (موديل هيكل القرآن نتركه كما هو، قد نحتاجه للإحصائيات لاحقاً، أو يمكن تجاهله حالياً)
class QuranStructure(models.Model):
    surah_id = models.IntegerField()
    surah_name = models.CharField(max_length=100)
    ayah_id = models.IntegerField()
    ayah_text = models.TextField()
    juz = models.IntegerField()
    hizb = models.IntegerField()
    rub = models.IntegerField()
    thumn = models.IntegerField()
    page = models.IntegerField()

    class Meta:
        unique_together = ('surah_id', 'ayah_id')

    def __str__(self):
        return f"{self.surah_name} - {self.ayah_id}"

# --- [تغيير جذري] الموديل الجديد لتتبع الأثمان ---
class ThumnProgress(models.Model):
    class Status(models.TextChoices):
        MEMORIZED = 'memorized', 'تم الحفظ'
        REVIEWING = 'reviewing', 'جاري المراجعة'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='thumn_progress')
    
    juz = models.IntegerField(verbose_name="الجزء")
    hizb = models.IntegerField(verbose_name="الحزب")
    thumn = models.IntegerField(verbose_name="رقم الثمن في الحزب") # 1 إلى 8
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.MEMORIZED)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # نضمن عدم تكرار نفس الثمن لنفس المستخدم
        unique_together = ('user', 'juz', 'hizb', 'thumn')
        ordering = ['juz', 'hizb', 'thumn']

    def __str__(self):
        return f"{self.user.username}: حزب {self.hizb} - ثمن {self.thumn} ({self.status})"

# (موديل السجل يبقى كما هو للملاحظات التاريخية)
class ProgressLog(models.Model):
    class LogType(models.TextChoices):
        MEMORIZATION = 'memorization', 'حفظ جديد'
        REVIEW = 'review', 'مراجعة'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logs')
    log_type = models.CharField(max_length=20, choices=LogType.choices)
    date = models.DateField(auto_now_add=True)
    quantity_description = models.CharField(max_length=255)
    self_notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date']