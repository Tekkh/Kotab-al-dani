from django.contrib import admin
from .models import RecitationSubmission

@admin.register(RecitationSubmission)
class RecitationSubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'surah_name', 'status', 'created_at', 'instructor_rating')
    list_filter = ('status', 'created_at')
    search_fields = ('student__username', 'surah_name', 'instructor_notes')
    readonly_fields = ('created_at', 'updated_at')