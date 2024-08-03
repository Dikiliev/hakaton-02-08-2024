from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_nested import routers
from .views import (
    MyTokenObtainPairView,
    CourseViewSet,
    ModuleViewSet,
    LessonViewSet,
    StepViewSet,
    TagViewSet,
    RegisterView,
    test_end_point,
    get_routes
)

# Основной роутер
router = routers.DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'tags', TagViewSet, basename='tag')

# Вложенный роутер для модулей в рамках курса
courses_router = routers.NestedDefaultRouter(router, r'courses', lookup='course')
courses_router.register(r'modules', ModuleViewSet, basename='course-modules')

# Вложенный роутер для уроков в рамках модуля
modules_router = routers.NestedDefaultRouter(courses_router, r'modules', lookup='module')
modules_router.register(r'lessons', LessonViewSet, basename='module-lessons')

# Вложенный роутер для шагов в рамках урока
lessons_router = routers.NestedDefaultRouter(modules_router, r'lessons', lookup='lesson')
lessons_router.register(r'steps', StepViewSet, basename='lesson-steps')

urlpatterns = [
    path('', include(router.urls)),          # Подключаем основные маршруты
    path('', include(courses_router.urls)),  # Подключаем вложенные маршруты для модулей
    path('', include(modules_router.urls)),  # Подключаем вложенные маршруты для уроков
    path('', include(lessons_router.urls)),  # Подключаем вложенные маршруты для шагов

    # Аутентификация и авторизация
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),

    # Прочие маршруты
    path('test/', test_end_point, name='test'),
    path('routes/', get_routes, name='get_routes'),  # Маршрут для получения всех доступных маршрутов
]
