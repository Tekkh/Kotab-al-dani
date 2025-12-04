from django.contrib import admin
from .models import Matn, TajweedLesson, Tafsir

@admin.register(Matn)
class MatnAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    search_fields = ('title', 'author')
    ordering = ('-id',)

@admin.register(TajweedLesson)
class TajweedLessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')
    list_editable = ('order',) # لتسهيل إعادة الترتيب
    search_fields = ('title',)

@admin.register(Tafsir)
class TafsirAdmin(admin.ModelAdmin):
    list_display = ('surah_name', 'surah_id')
    ordering = ('surah_id',)
    search_fields = ('surah_name',)