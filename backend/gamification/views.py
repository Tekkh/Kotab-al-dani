from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserBadge, GamificationProfile
from .serializers import UserBadgeSerializer, GamificationProfileSerializer
from .services import calculate_level, check_and_award_badges

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

class SetPreviousProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # 1. استلام عدد الأحزاب من الواجهة
        hizb_count = request.data.get('hizb_count', 0)
        
        try:
            hizb_count = int(hizb_count)
            if hizb_count < 0 or hizb_count > 60:
                return Response({"error": "عدد الأحزاب غير منطقي"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "يجب إدخال رقم صحيح"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. جلب البروفايل
        profile, _ = GamificationProfile.objects.get_or_create(user=request.user)

        # 3. التحويل إلى أثمان (1 حزب = 8 أثمان)
        thumns_count = hizb_count * 8
        profile.initial_memorization_thumns = thumns_count
        
        # 4. إعادة حساب النقاط والمستوى
        # (نقاط الحفظ الجديد + نقاط الحفظ السابق) * 10
        # نحتاج لجلب الحفظ الجديد الفعلي من ThumnProgress لتكون الحسبة دقيقة
        from progress.models import ThumnProgress
        actual_memorized = ThumnProgress.objects.filter(user=request.user, status='memorized').count()
        
        total_thumns = actual_memorized + thumns_count
        profile.total_xp = total_thumns * 10
        profile.level = calculate_level(profile.total_xp)
        
        profile.save()

        # 5. فحص الأوسمة (قد يستحق أوسمة جديدة فوراً)
        check_and_award_badges(request.user)

        return Response({"message": "تم تحديث الرصيد السابق بنجاح", "level": profile.level, "xp": profile.total_xp})