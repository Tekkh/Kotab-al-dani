from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# 1. موديل الأوسمة (سنضيف الأوسمة لاحقاً في Admin)
class Badge(models.Model):
    CONDITION_TYPES = [
        # --- البدايات ---
        ('first_thumn', 'بداية الغيث (أول ثمن)'),
        
        # --- الكمية (بالأحزاب) ---
        ('first_hizb', 'رائحة الفجر (أول حزب)'),
        ('hizb_3', 'خطوة السائر (3 أحزاب)'),
        ('hizb_5', 'همة عالية (5 أحزاب)'),
        ('hizb_7', 'زاد المسافر (7 أحزاب)'),
        ('hizb_10', 'نفس المجتهد (10 أحزاب)'),
        ('hizb_15', 'ربع القرآن (15 حزب)'),
        ('hizb_20', 'عزيمة لا تلين (20 حزب)'),
        ('hizb_30', 'نصف القرآن (30 حزب)'),
        ('hizb_60', 'تاج الحافظ (الختمة)'),

        # --- السور والأجزاء ---
        ('juz_amma', 'نور عم (جزء 30)'),
        ('juz_tabarak', 'تبارك البركة (جزء 29)'),
        ('surah_mulk', 'المُنجيَة (سورة الملك)'),
        ('surah_yasin', 'القلب الحي (سورة يس)'),
        ('surah_baqarah', 'سيدة السور (سورة البقرة)'),
        ('surah_rahman', 'درر الرحمن (سورة الرحمن)'),
        ('surah_kahf', 'نور الكهف (سورة الكهف)'),

        # --- الاستمرارية (المداومة) ---
        ('streak_7', 'خطوة كل يوم (7 أيام)'),
        ('streak_30', 'طريق النور (30 يوم)'),
        ('streak_100', 'روح المثابر (100 يوم)'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, help_text="اسم الأيقونة (مثال: star, award, crown)")
    condition_type = models.CharField(max_length=50, choices=CONDITION_TYPES, unique=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

# 2. موديل ربط الأوسمة بالطالب
class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"

# 3. [الجديد] بروفايل الألعاب (النقاط والمستوى)
class GamificationProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='game_profile')

    total_xp = models.IntegerField(default=0, verbose_name="مجموع نقاط الخبرة")
    level = models.IntegerField(default=1, verbose_name="المستوى الحالي")
    
    # هنا نخزن "الحفظ السابق" (محولاً إلى أثمان) ليتم إضافته للحساب
    initial_memorization_thumns = models.IntegerField(default=0, verbose_name="رصيد الحفظ السابق (أثمان)")
    current_streak = models.IntegerField(default=0, verbose_name="أيام المداومة الحالية")
    last_activity_date = models.DateField(null=True, blank=True, verbose_name="تاريخ آخر نشاط")
    profile_picture = models.ImageField(
        upload_to='profile_pics/', 
        null=True, 
        blank=True, 
        verbose_name="الصورة الشخصية"
    )

    def __str__(self):
        return f"{self.user.username} - Lv.{self.level} ({self.total_xp} XP)"

# إشارة: إنشاء بروفايل تلقائي عند تسجيل أي مستخدم جديد
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        GamificationProfile.objects.create(user=instance)