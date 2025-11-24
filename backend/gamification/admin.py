from django.contrib import admin
from .models import Badge, UserBadge, GamificationProfile

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'condition_type')

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    list_filter = ('badge', 'user')

# --- [الجديد] تسجيل بروفايل النقاط ---
@admin.register(GamificationProfile)
class GamificationProfileAdmin(admin.ModelAdmin):
    # الأعمدة التي ستظهر في الجدول
    list_display = ('user', 'total_xp', 'level', 'initial_memorization_thumns')
    # إمكانية البحث باسم المستخدم
    search_fields = ('user__username',)
    # فلترة حسب المستوى
    list_filter = ('level',)