from django.db import models
from django.contrib.auth.models import User

class Badge(models.Model):
    # أنواع الشروط التي سنبرمجها
    CONDITION_TYPES = [
        ('first_thumn', 'أول ثمن محفوظ'),
        ('first_hizb', 'أول حزب كامل'),
        ('juz_amma', 'إتمام جزء عم'),
        ('count_5_thumns', 'حفظ 5 أثمان'),
    ]

    name = models.CharField(max_length=100, verbose_name="اسم الوسام")
    description = models.TextField(verbose_name="وصف")
    icon_name = models.CharField(max_length=50, help_text="اسم الأيقونة (مثال: star, award, trophy)")
    condition_type = models.CharField(max_length=50, choices=CONDITION_TYPES, unique=True)
    
    # للحصول على ترتيب في العرض
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge') # الوسام يُمنح مرة واحدة فقط
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"