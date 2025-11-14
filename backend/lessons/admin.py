from django.contrib import admin

from .models import WeeklyLesson

# تسجيل الموديل ليظهر في لوحة التحكم
@admin.register(WeeklyLesson)
class WeeklyLessonAdmin(admin.ModelAdmin):
    # الحقول التي ستظهر كأعمدة في القائمة
    list_display = ('day_of_week', 'lesson_title', 'time_description', 'order', 'is_active')

    # الحقول التي يمكن التعديل عليها مباشرة من القائمة
    list_editable = ('order', 'is_active')

    # إضافة فلتر جانبي لسهولة البحث
    list_filter = ('day_of_week', 'is_active')
