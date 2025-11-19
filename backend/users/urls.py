from django.urls import path
from .views import CreateUserView, LoginView, StudentListView

urlpatterns = [
    # هذا ينشئ الرابط: /api/auth/register/
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('students-progress/', StudentListView.as_view(), name='students-progress'),
]