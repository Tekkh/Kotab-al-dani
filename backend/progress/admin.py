from django.contrib import admin
from .models import QuranStructure, UserProgress, ProgressLog

# --- 1. تسجيل هيكل القرآن ---
# هذا مهم لإدارة بيانات القرآن الأولية
@admin.register(QuranStructure)
class QuranStructureAdmin(admin.ModelAdmin):
    list_display = ('surah_name', 'ayah_id', 'juz', 'page')
    search_fields = ('surah_name', 'ayah_text') # للبحث السريع
    list_filter = ('surah_name', 'juz')

# --- 2. تسجيل تقدم المستخدم ---
# هذا للعرض والبحث فقط (لا ينصح بالتعديل اليدوي الكثير)
@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'ayah', 'status', 'last_review_date')
    search_fields = ('user__username', 'ayah__surah_name')
    list_filter = ('status', 'user')

# --- 3. تسجيل سجل الأوراد ---
@admin.register(ProgressLog)
class ProgressLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'log_type', 'date', 'quantity_description')
    search_fields = ('user__username', 'quantity_description')
    list_filter = ('log_type', 'date')