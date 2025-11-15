from django.urls import path
from .views import CreateUserView, LoginView

urlpatterns = [
    # هذا ينشئ الرابط: /api/auth/register/
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]