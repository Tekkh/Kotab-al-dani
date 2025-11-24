from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# 1. موديل الأوسمة (سنضيف الأوسمة لاحقاً في Admin)
class Badge(models.Model):
    CONDITION_TYPES = [
        ('first_thumn', 'أول ثمن محفوظ'),
        ('first_hizb', 'أول حزب كامل'),
        ('count_5_thumns', 'حفظ 5 أثمان'),
        # ... سنضيف المزيد لاحقاً
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50)
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

    def __str__(self):
        return f"{self.user.username} - Lv.{self.level} ({self.total_xp} XP)"

# إشارة: إنشاء بروفايل تلقائي عند تسجيل أي مستخدم جديد
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        GamificationProfile.objects.create(user=instance)