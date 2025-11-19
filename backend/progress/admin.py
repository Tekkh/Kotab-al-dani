from django.contrib import admin
from .models import QuranStructure, ThumnProgress, ProgressLog

@admin.register(QuranStructure)
class QuranStructureAdmin(admin.ModelAdmin):
    list_display = ('surah_name', 'ayah_id', 'juz', 'page')
    search_fields = ('surah_name',)
    list_filter = ('juz',)

# [تحديث] استخدام الموديل الجديد
@admin.register(ThumnProgress)
class ThumnProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'juz', 'hizb', 'thumn', 'status', 'updated_at')
    list_filter = ('status', 'user', 'hizb')
    ordering = ('user', 'juz', 'hizb', 'thumn')

@admin.register(ProgressLog)
class ProgressLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'log_type', 'date', 'quantity_description')
    list_filter = ('log_type', 'date')