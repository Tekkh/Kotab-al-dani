from rest_framework import viewsets, permissions
from .models import ProgressLog, UserProgress, QuranStructure
from .serializers import ProgressLogSerializer, UserProgressSerializer, QuranStructureSerializer

# 1. View لسجل الوِرد (الملاحظات)
class ProgressLogViewSet(viewsets.ModelViewSet):
    """
    API endpoint لإدارة سجلات الأوراد (الملاحظات) الخاصة بالمستخدم.
    """
    serializer_class = ProgressLogSerializer
    # الصلاحية: يجب أن يكون المستخدم مسجل دخوله (افتراضيًا من settings.py)

    def get_queryset(self):
        # [هام جداً] إرجاع سجلات هذا المستخدم فقط
        return ProgressLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # [هام جداً] عند إنشاء سجل جديد، قم بتعيين المستخدم تلقائيًا
        serializer.save(user=self.request.user)

# 2. View لتقدم المستخدم (حالة الآيات)
class UserProgressViewSet(viewsets.ModelViewSet):
    """
    API endpoint لإدارة حالة حفظ الآيات الخاصة بالمستخدم.
    """
    serializer_class = UserProgressSerializer

    def get_queryset(self):
        # إرجاع حالة الآيات لهذا المستخدم فقط
        return UserProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # عند إنشاء حالة آية جديدة، قم بتعيين المستخدم تلقائيًا
        serializer.save(user=self.request.user)
        
# --- 3. [جديد] View لهيكل القرآن ---
class QuranStructureViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint للقراءة فقط، يعرض هيكل القرآن (الآيات، الصفحات، إلخ).
    """
    queryset = QuranStructure.objects.all()
    serializer_class = QuranStructureSerializer

    # [هام] هذا الـ API للقراءة فقط، ولكن يجب أن تكون مسجلاً لترى
    # (يمكن تغيير هذا إلى permissions.AllowAny إذا أردنا أن يكون عاماً)
    permission_classes = [permissions.IsAuthenticated]