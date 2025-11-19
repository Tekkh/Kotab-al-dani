from rest_framework import viewsets, permissions
from .models import ProgressLog, ThumnProgress, QuranStructure
from .serializers import ProgressLogSerializer, ThumnProgressSerializer, QuranStructureSerializer

class ProgressLogViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressLogSerializer
    def get_queryset(self):
        return ProgressLog.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# [تحديث] ViewSet للموديل الجديد
class ThumnProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ThumnProgressSerializer

    def get_queryset(self):
        return ThumnProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class QuranStructureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QuranStructure.objects.all()
    serializer_class = QuranStructureSerializer
    permission_classes = [permissions.IsAuthenticated]