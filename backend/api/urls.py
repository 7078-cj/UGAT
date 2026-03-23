from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .Views.user_views import ( registerUser, 
                                MyTokenObtainPairView,
                                test,
                                registerAdmin)
from .Views.farm_views import (
    FarmListCreateView,
    FarmDetailView,
    ExportDetailView,
    ExportListCreateView,
    PortfolioListCreateView,
    PortfolioDetailView
)


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', registerUser, name='register_user'),
    path('register/farmer', registerUser, name='register_farmer'),
    path('register/admin', registerAdmin, name='register_admin'),
    
    path('farms/',                 FarmListCreateView.as_view(),    name='farm_list_create'),
    path('farms/<int:pk>/',        FarmDetailView.as_view(),        name='farm_detail'),

    path('farms/<int:farm_pk>/exports/',                             ExportListCreateView.as_view(), name='export_list_create'),
    path('farms/<int:farm_pk>/exports/<int:export_pk>/',             ExportDetailView.as_view(),     name='export_detail'),

    path('farms/<int:farm_pk>/exports/<int:export_pk>/photos/',      PortfolioListCreateView.as_view(), name='portfolio_list_create'),
    path('farms/<int:farm_pk>/exports/<int:export_pk>/photos/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio_detail'),
]
