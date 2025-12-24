from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AllBadgesView, MyProfileView, SetPreviousProgressView, UserBadgeViewSet

router = DefaultRouter()
router.register(r'my-badges', UserBadgeViewSet, basename='my-badges')

urlpatterns = [
    path('my-profile/', MyProfileView.as_view(), name='my-profile'),
    path('set-previous-progress/', SetPreviousProgressView.as_view(), name='set-previous-progress'),
    path('all-badges/', AllBadgesView.as_view(), name='all-badges'),
    path('', include(router.urls)),
]