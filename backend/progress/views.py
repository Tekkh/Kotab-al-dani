from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, permissions
from .models import ProgressLog, ThumnProgress, QuranStructure
from .serializers import ProgressLogSerializer, ThumnProgressSerializer, QuranStructureSerializer
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

class SupervisorDashboardView(APIView):
    permission_classes = [IsAdminUser] # للمشرفين فقط

    def get(self, request):
        # 1. حساب العدادات العلوية
        # ------------------------
        
        # أ) إجمالي الطلاب (نستثني المشرفين)
        total_students = User.objects.filter(is_staff=False).count()

        # ب) الطلاب النشطين اليوم (من سجلوا حفظاً أو نالوا وساماً في آخر 24 ساعة)
        last_24h = timezone.now() - timedelta(hours=24)
        active_students_count = UserProgress.objects.filter(
            updated_at__gte=last_24h
        ).values('user').distinct().count()

        # ج) حصاد الكُتّاب (إجمالي الأحزاب المحفوظة)
        # نحسب عدد الأثمان المحفوظة كلياً ونقسمها على 8
        total_athman = UserProgress.objects.filter(is_completed=True).count()
        total_ahzab = round(total_athman / 8, 1) # تقريب لرقم عشري واحد

        # 2. سجل النشاطات الحية (Feed)
        # ---------------------------
        # سنجلب آخر 10 إنجازات (حفظ) وآخر 5 أوسمة وندمجهم
        
        activities = []

        # جلب أحدث عمليات الحفظ
        recent_progress = UserProgress.objects.filter(is_completed=True).select_related('user').order_by('-updated_at')[:10]
        for p in recent_progress:
            activities.append({
                'type': 'progress',
                'student_name': f"{p.user.first_name} {p.user.last_name}",
                'description': f"أتم حفظ {p.get_hifz_type_display()}: {p.amount_description}",
                'timestamp': p.updated_at
            })

        # جلب أحدث الأوسمة
        recent_badges = UserBadge.objects.select_related('user', 'badge').order_by('-earned_at')[:5]
        for b in recent_badges:
            activities.append({
                'type': 'badge',
                'student_name': f"{b.user.first_name} {b.user.last_name}",
                'description': f"نال وسام: {b.badge.name} 🥇",
                'timestamp': b.earned_at
            })

        # دمج وترتيب القائمة حسب الوقت (الأحدث أولاً)
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # نأخذ أحدث 10 نشاطات فقط للعرض
        final_feed = activities[:10]

        return Response({
            "stats": {
                "total_students": total_students,
                "active_today": active_students_count,
                "total_ahzab": total_ahzab
            },
            "feed": final_feed
        })