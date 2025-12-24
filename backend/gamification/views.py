from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Badge, GamificationProfile, UserBadge
from .serializers import BadgeSerializer, GamificationProfileSerializer, UserBadgeSerializer
from .services import assign_badge, calculate_level, check_and_award_badges


class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    عرض أوسمة المستخدم الحالي.
    """
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).order_by('-earned_at')


class MyProfileView(generics.RetrieveUpdateAPIView):
    """
    عرض وتحديث الملف الشخصي (البيانات + التقدم).
    """
    serializer_class = GamificationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = GamificationProfile.objects.get_or_create(user=self.request.user)
        return profile


class SetPreviousProgressView(APIView):
    """
    إضافة رصيد سابق (أحزاب أو أوسمة محددة) يدوياً.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        hizb_count_input = request.data.get('hizb_count', 0)
        specific_badges = request.data.get('specific_badges', [])

        # معالجة عدد الأحزاب
        manual_hizbs = 0
        try:
            manual_hizbs = max(0, int(hizb_count_input))
        except (ValueError, TypeError):
            pass

        # قيم الأوسمة بالأثمان
        BADGE_THUMN_VALUES = {
            'juz_amma': 16, 'juz_tabarak': 16, 'surah_baqarah': 40,
            'surah_kahf': 8, 'surah_yasin': 4, 'surah_mulk': 2, 'surah_rahman': 2,
        }

        badges_thumns_value = 0
        if isinstance(specific_badges, list):
            for badge_code in specific_badges:
                if badge_code in BADGE_THUMN_VALUES:
                    badges_thumns_value += BADGE_THUMN_VALUES[badge_code]
                assign_badge(request.user, badge_code)

        new_thumns_to_add = (manual_hizbs * 8) + badges_thumns_value

        # تحديث البروفايل
        profile, _ = GamificationProfile.objects.get_or_create(user=request.user)
        profile.initial_memorization_thumns += new_thumns_to_add
        
        # إعادة الحساب الكلي
        # ملاحظة: استيراد محلي لتجنب Circular Import
        from progress.models import ThumnProgress
        actual_memorized = ThumnProgress.objects.filter(user=request.user, status='memorized').count()
        
        grand_total = actual_memorized + profile.initial_memorization_thumns
        profile.total_xp = grand_total * 10
        profile.level = calculate_level(profile.total_xp)
        profile.save()

        check_and_award_badges(request.user)

        return Response({
            "message": "تمت إضافة الرصيد بنجاح", 
            "level": profile.level, 
            "xp": profile.total_xp,
            "added_thumns": new_thumns_to_add,
            "total_initial": profile.initial_memorization_thumns
        })


class AllBadgesView(generics.ListAPIView):
    """
    عرض قائمة جميع الأوسمة المتاحة في النظام.
    """
    queryset = Badge.objects.all().order_by('order')
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]