from rest_framework import viewsets, permissions, generics
from .models import UserBadge, GamificationProfile
from .serializers import UserBadgeSerializer, GamificationProfileSerializer

class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # إرجاع أوسمة المستخدم الحالي فقط
        return UserBadge.objects.filter(user=self.request.user).order_by('-earned_at')

class MyProfileView(generics.RetrieveAPIView):
    serializer_class = GamificationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # إرجاع بروفايل المستخدم الحالي (أو إنشاؤه إذا لم يوجد)
        profile, _ = GamificationProfile.objects.get_or_create(user=self.request.user)
        return profile