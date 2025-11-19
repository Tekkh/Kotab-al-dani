from rest_framework import serializers
from .models import UserBadge, Badge

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    # لعرض تفاصيل الوسام (الاسم، الأيقونة) بدلاً من مجرد الـ ID
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']