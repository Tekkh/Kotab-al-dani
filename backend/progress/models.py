from django.db import models
from django.contrib.auth.models import User # لاستيراد المستخدم

# --- 1. الموديل الأول: هيكل القرآن ---
# هذا الجدول سنقوم باملائه "مرة واحدة" ببيانات القرآن (لاحقاً)
class QuranStructure(models.Model):
    surah_id = models.IntegerField()
    surah_name = models.CharField(max_length=100)
    ayah_id = models.IntegerField()
    ayah_text = models.TextField() # نص الآية
    juz = models.IntegerField()
    hizb = models.IntegerField()
    rub = models.IntegerField()
    thumn = models.IntegerField()
    page = models.IntegerField()

    class Meta:
        # نضمن عدم تكرار الآيات
        unique_together = ('surah_id', 'ayah_id')
        ordering = ['surah_id', 'ayah_id']

    def __str__(self):
        return f"سورة {self.surah_name} - آية {self.ayah_id}"

# --- 2. الموديل الثاني: تقدم المستخدم ---
# هذا هو الجدول الذي يحدد لون كل آية في المصحف التفاعلي
class UserProgress(models.Model):
    class ProgressStatus(models.TextChoices):
        NOT_MEMORIZED = 'not_memorized', 'غير محفوظ'
        MEMORIZED = 'memorized', 'محفوظ'
        REVIEWING = 'reviewing', 'مراجعة'

    # الربط بالمستخدم (إذا حذف المستخدم، يتم حذف تقدمه)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')

    # الربط بالآية
    ayah = models.ForeignKey(QuranStructure, on_delete=models.CASCADE, related_name='user_progress')

    # حالة الحفظ (محفوظ، مراجعة، إلخ)
    status = models.CharField(
        max_length=20,
        choices=ProgressStatus.choices,
        default=ProgressStatus.NOT_MEMORIZED
    )
    last_review_date = models.DateField(null=True, blank=True)

    class Meta:
        # نضمن أن لكل مستخدم إدخال واحد فقط لكل آية
        unique_together = ('user', 'ayah')

    def __str__(self):
        return f"{self.user.username} - {self.ayah.surah_name} ({self.ayah.ayah_id}) - {self.status}"

# --- 3. الموديل الثالث: سجل الوِرد اليومي (للملاحظات) ---
class ProgressLog(models.Model):
    class LogType(models.TextChoices):
        MEMORIZATION = 'memorization', 'حفظ جديد'
        REVIEW = 'review', 'مراجعة'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logs')
    log_type = models.CharField(max_length=20, choices=LogType.choices)
    date = models.DateField(auto_now_add=True)

    # نص يصف الكمية (مثال: "من البقرة: 1 إلى البقرة: 5")
    quantity_description = models.CharField(max_length=255)

    # الملاحظات الذاتية التي اتفقنا عليها
    self_notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date'] # ترتيب السجلات من الأحدث للأقدم

    def __str__(self):
        return f"{self.user.username} - {self.log_type} - {self.date}"