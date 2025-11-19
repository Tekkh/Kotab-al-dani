from django.contrib.auth.models import User
from rest_framework import serializers
from progress.models import UserProgress

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # الحقول التي نريد طلبها من المستخدم
        fields = ('id', 'username', 'email', 'password')
        # إعدادات خاصة: كلمة المرور يجب أن تكون "للكتابة فقط" (لا تظهر عند قراءة البيانات)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # هذه الدالة هي المسؤولة عن إنشاء المستخدم
        # نستخدم .create_user() لضمان تشفير كلمة المرور (hashing)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class StudentSummarySerializer(serializers.ModelSerializer):
    total_memorized = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'total_memorized', 'last_activity']

    def get_total_memorized(self, obj):
        # حساب عدد الآيات المحفوظة
        return obj.progress.filter(status='memorized').count()

    def get_last_activity(self, obj):
        # آخر مرة سجل فيها وِرداً
        last_log = obj.logs.order_by('-date').first()
        return last_log.date if last_log else None