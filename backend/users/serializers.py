from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
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
        # [تحديث] نحسب عدد "الأثمان" المحفوظة بدلاً من الآيات
        # نستخدم related_name='thumn_progress' الذي عرفناه في الموديل الجديد
        return obj.thumn_progress.filter(status='memorized').count()

    def get_last_activity(self, obj):
        last_log = obj.logs.order_by('-date').first()
        return last_log.date if last_log else None