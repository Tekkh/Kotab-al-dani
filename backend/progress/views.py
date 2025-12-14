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
    permission_classes = [IsAdminUser]

    def get(self, request):
        
        # أ) إجمالي الطلاب (نستثني المشرفين والمدراء)
        total_students = User.objects.filter(is_staff=False, is_superuser=False).count()

        today = timezone.now().date()
        
        active_in_logs = ProgressLog.objects.filter(date=today).values('user').distinct().count()
        
        # نعد أيضاً من حصلوا على أوسمة في آخر 24 ساعة (للاحتياط)
        last_24h = timezone.now() - timedelta(hours=24)
        active_in_badges = UserBadge.objects.filter(earned_at__gte=last_24h).values('user').distinct().count()
        
        # الرقم الأكبر هو النشاط الحقيقي
        active_students_count = max(active_in_logs, active_in_badges)

        :
        # نجمع عدد الأثمان المحفوظة من جدول ThumnProgress
        # كل سجل في ThumnProgress يمثل ثمناً واحداً
        total_thumns = ThumnProgress.objects.filter(status=ThumnProgress.Status.MEMORIZED).count()
        
        # تحويل الأثمان لأحزاب (الحزب = 8 أثمان)
        total_ahzab = round(total_thumns / 8, 2)

        # ---------------------------
        # 2. سجل النشاطات (Feed)
        # ---------------------------
        activities = []

        recent_logs = ProgressLog.objects.all().select_related('user').order_by('-date', '-id')[:10]
        
        for log in recent_logs:
            # تحديد نوع النشاط من log_type
            if log.log_type == ProgressLog.LogType.MEMORIZATION:
                action_text = "حفظ جديد"
                icon_type = 'progress'
            else:
                action_text = "مراجعة"
                icon_type = 'review' # يمكننا استخدام أيقونة مختلفة للمراجعة لاحقاً إن شئنا
            
            # صياغة الاسم
            student_name = f"{log.user.first_name} {log.user.last_name}".strip()
            if not student_name:
                student_name = log.user.username

            activities.append({
                'type': icon_type,
                'student_name': student_name,
                'description': f"قام بـ{action_text}: {log.quantity_description}", 
                'timestamp': log.date.isoformat() 
            })

        # هذا الموديل عادة يحتوي على timestamp دقيق (earned_at)
        recent_badges = UserBadge.objects.all().select_related('user', 'badge').order_by('-earned_at')[:5]
        
        for b in recent_badges:
            student_name = f"{b.user.first_name} {b.user.last_name}".strip()
            if not student_name:
                student_name = b.user.username

            activities.append({
                'type': 'badge',
                'student_name': student_name,
                'description': f"نال وسام: {b.badge.name} 🥇",
                'timestamp': b.earned_at # هذا datetime
            })

        
        activities.sort(key=lambda x: str(x['timestamp']), reverse=True)
        
        return Response({
            "stats": {
                "total_students": total_students,
                "active_today": active_students_count,
                "total_ahzab": total_ahzab
            },
            "feed": activities[:15]
        })