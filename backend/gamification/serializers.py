from rest_framework import serializers
from .models import UserBadge, Badge, GamificationProfile

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

class GamificationProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = GamificationProfile
        fields = ['username', 'total_xp', 'level', 'initial_memorization_thumns', 'current_streak']