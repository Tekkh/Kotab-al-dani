from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/library/', include('library.urls')),

    path('api/', include('lessons.urls')),
    path('api/', include('gamification.urls')),
    path('api/', include('progress.urls')),
]

# إعدادات الميديا (للصور والملفات الصوتية) في وضع التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)