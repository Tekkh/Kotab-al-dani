from rest_framework import viewsets, permissions
from .models import ProgressLog, ThumnProgress, QuranStructure
from .serializers import ProgressLogSerializer, ThumnProgressSerializer, QuranStructureSerializer

# [جديد] استيراد موديل أوسمة المستخدم للتحقق
from gamification.models import UserBadge 

class ProgressLogViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressLogSerializer
    def get_queryset(self):
        return ProgressLog.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ThumnProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ThumnProgressSerializer

    def get_queryset(self):
        return ThumnProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # --- [جديد] دالة الإنشاء المعدلة لاكتشاف الأوسمة الجديدة ---
    def create(self, request, *args, **kwargs):
        # 1. لقطة "قبل": نسجل IDs الأوسمة التي يمتلكها الطالب حالياً
        existing_badge_ids = list(
            UserBadge.objects.filter(user=request.user).values_list('id', flat=True)
        )

        # 2. ننفذ الحفظ الطبيعي (هنا تنطلق الـ Signals وتمنح الأوسمة الجديدة إن وجدت)
        response = super().create(request, *args, **kwargs)

        # 3. لقطة "بعد": نبحث عن أي وسام لهذا المستخدم لم يكن موجوداً في القائمة القديمة
        new_badges_qs = UserBadge.objects.filter(
            user=request.user
        ).exclude(id__in=existing_badge_ids)

        # 4. إذا وجدنا أوسمة جديدة، نحقنها داخل الرد (Response)
        if new_badges_qs.exists():
            new_badges_data = []
            for ub in new_badges_qs:
                new_badges_data.append({
                    'name': ub.badge.name,
                    'icon_name': ub.badge.icon_name,
                    'description': ub.badge.description
                })
            
            # إضافة الحقل الجديد للرد JSON
            # الرد الأصلي يحتوي على بيانات الثمن، نضيف له 'new_badges'
            response.data['new_earned_badges'] = new_badges_data
            print(f"🎁 تم إرسال {len(new_badges_data)} وسام جديد في الرد.")

        return response

class QuranStructureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QuranStructure.objects.all()
    serializer_class = QuranStructureSerializer
    permission_classes = [permissions.IsAuthenticated]