from rest_framework import serializers
from .models import RecitationSubmission

# 1. محول الطالب (للرفع والعرض)
class RecitationSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.first_name', read_only=True) # لعرض اسم الطالب للمشرف
    
    class Meta:
        model = RecitationSubmission
        fields = [
            'id', 'student_name', 'audio_file', 
            'surah_name', 'from_ayah', 'to_ayah', 
            'status', 
            'instructor_rating', 'instructor_notes', 'instructor_audio',
            'created_at', 'reviewed_at'
        ]
        # حقول يقرؤها الطالب فقط ولا يستطيع تعديلها
        read_only_fields = [
            'status', 'instructor_rating', 'instructor_notes', 
            'instructor_audio', 'created_at', 'reviewed_at'
        ]

# 2. محول المشرف (لإرسال التقييم)
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecitationSubmission
        fields = ['status', 'instructor_rating', 'instructor_notes', 'instructor_audio']

    def update(self, instance, validated_data):
        # تحديث وقت المراجعة تلقائياً عند الحفظ
        from django.utils import timezone
        instance.reviewed_at = timezone.now()
        return super().update(instance, validated_data)