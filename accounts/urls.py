from django.urls import path
from .views import login_view, profile_view
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
     path("profile/", profile_view)
]