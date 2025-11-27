from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Badge, UserBadge, GamificationProfile
from .serializers import UserBadgeSerializer, GamificationProfileSerializer, BadgeSerializer
from .services import calculate_level, check_and_award_badges, assign_badge

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

# تأكد من وجود هذا الاستيراد في الأعلى
from .services import calculate_level, check_and_award_badges, assign_badge 

# ... (الكلاسات الأخرى)

class SetPreviousProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # 1. معالجة عدد الأحزاب (الكمية)
        hizb_count = request.data.get('hizb_count', 0)
        
        try:
            hizb_count = int(hizb_count)
            if hizb_count < 0 or hizb_count > 60:
                return Response({"error": "عدد الأحزاب غير منطقي"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "يجب إدخال رقم صحيح"}, status=status.HTTP_400_BAD_REQUEST)

        # تحديث البروفايل بالكمية
        profile, _ = GamificationProfile.objects.get_or_create(user=request.user)
        thumns_count = hizb_count * 8
        profile.initial_memorization_thumns = thumns_count
        
        # إعادة حساب النقاط والمستوى
        from progress.models import ThumnProgress
        actual_memorized = ThumnProgress.objects.filter(user=request.user, status='memorized').count()
        total_thumns = actual_memorized + thumns_count
        
        profile.total_xp = total_thumns * 10
        profile.level = calculate_level(profile.total_xp)
        profile.save()

        # منح أوسمة الكمية تلقائياً
        check_and_award_badges(request.user)

        # ---------------------------------------------------------
        # 2. [جديد] معالجة الأوسمة النوعية (Checkboxes)
        # ---------------------------------------------------------
        # نستقبل قائمة بأسماء الشروط التي اختارها الطالب
        # مثال: specific_badges = ['juz_amma', 'surah_baqarah']
        specific_badges = request.data.get('specific_badges', [])

        # قائمة الأوسمة المسموح باختيارها يدوياً (للأمان)
        ALLOWED_MANUAL_BADGES = [
            'juz_amma', 'juz_tabarak', 
            'surah_baqarah', 'surah_yasin', 
            'surah_mulk', 'surah_rahman', 'surah_kahf'
        ]

        new_badges_names = []

        if isinstance(specific_badges, list):
            for badge_code in specific_badges:
                if badge_code in ALLOWED_MANUAL_BADGES:
                    # نمنح الوسام فوراً
                    assign_badge(request.user, badge_code)
                    new_badges_names.append(badge_code)

        return Response({
            "message": "تم تحديث الرصيد والأوسمة بنجاح", 
            "level": profile.level, 
            "xp": profile.total_xp,
            "awarded_manual": new_badges_names
        })
class AllBadgesView(generics.ListAPIView):
    queryset = Badge.objects.all().order_by('order')
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]