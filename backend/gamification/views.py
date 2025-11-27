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
        # 1. استلام البيانات الجديدة
        hizb_count_input = request.data.get('hizb_count', 0)
        specific_badges = request.data.get('specific_badges', [])

        # معالجة الرقم اليدوي
        manual_hizbs = 0
        if hizb_count_input:
            try:
                manual_hizbs = int(hizb_count_input)
                if manual_hizbs < 0: manual_hizbs = 0
            except ValueError:
                pass

        # 2. حساب قيمة "الإضافة الجديدة"
        BADGE_THUMN_VALUES = {
            'juz_amma': 16,
            'juz_tabarak': 16,
            'surah_baqarah': 40,
            'surah_kahf': 8,
            'surah_yasin': 4,
            'surah_mulk': 2,
            'surah_rahman': 2,
        }

        badges_thumns_value = 0
        new_badges_names = []

        if isinstance(specific_badges, list):
            for badge_code in specific_badges:
                # نجمع قيمة السورة فقط إذا كانت في القاموس
                if badge_code in BADGE_THUMN_VALUES:
                    badges_thumns_value += BADGE_THUMN_VALUES[badge_code]
                
                # نمنح الوسام
                assign_badge(request.user, badge_code)
                new_badges_names.append(badge_code)

        # مجموع الأثمان *الجديدة* المراد إضافتها
        new_thumns_to_add = (manual_hizbs * 8) + badges_thumns_value

        # 3. التحديث التراكمي في قاعدة البيانات
        profile, _ = GamificationProfile.objects.get_or_create(user=request.user)
        
        # [تعديل جوهري]: نستخدم += للإضافة بدلاً من = للاستبدال
        profile.initial_memorization_thumns += new_thumns_to_add
        
        # 4. إعادة حساب النقاط والمستوى الكلي
        from progress.models import ThumnProgress
        actual_memorized = ThumnProgress.objects.filter(user=request.user, status='memorized').count()
        
        # المجموع الكلي = المحفوظ فعلياً + (الرصيد السابق القديم + الإضافة الجديدة)
        grand_total = actual_memorized + profile.initial_memorization_thumns
        
        profile.total_xp = grand_total * 10
        profile.level = calculate_level(profile.total_xp)
        profile.save()

        # فحص أوسمة الكمية
        check_and_award_badges(request.user)

        return Response({
            "message": "تمت إضافة الرصيد بنجاح", 
            "level": profile.level, 
            "xp": profile.total_xp,
            "added_thumns": new_thumns_to_add,
            "total_initial": profile.initial_memorization_thumns
        })
class AllBadgesView(generics.ListAPIView):
    queryset = Badge.objects.all().order_by('order')
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]