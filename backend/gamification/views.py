from rest_framework import viewsets, permissions
from .models import UserBadge
from .serializers import UserBadgeSerializer

class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # إرجاع أوسمة المستخدم الحالي فقط
        return UserBadge.objects.filter(user=self.request.user).order_by('-earned_at')