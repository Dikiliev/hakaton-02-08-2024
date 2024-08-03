from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_nested import routers
from . import views
from .views import (
    MyTokenObtainPairView,
    CourseViewSet,
    LessonViewSet,
    TagViewSet,
    RegisterView,
)

# Основной роутер
router = routers.DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'tags', TagViewSet, basename='tag')

# Вложенный роутер для уроков в рамках курса
courses_router = routers.NestedDefaultRouter(router, r'courses', lookup='course')
courses_router.register(r'lessons', LessonViewSet, basename='course-lessons')

urlpatterns = [
    path('', include(router.urls)),  # Подключаем основные маршруты
    path('', include(courses_router.urls)),  # Подключаем вложенные маршруты

    # Аутентификация и авторизация
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),

    # Прочие маршруты
    path('test/', views.test_end_point, name='test'),
    path('', views.get_routes),  # Убедитесь, что это не конфликтует с другими путями
]
