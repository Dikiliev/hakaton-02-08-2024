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
    get_routes, CourseProgressView, UserCoursesView
)

# Основной роутер
router = routers.DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'tags', TagViewSet, basename='tag')

# Вложенные роутеры
courses_router = routers.NestedDefaultRouter(router, r'courses', lookup='course')
courses_router.register(r'modules', ModuleViewSet, basename='course-modules')

modules_router = routers.NestedDefaultRouter(courses_router, r'modules', lookup='module')
modules_router.register(r'lessons', LessonViewSet, basename='module-lessons')

lessons_router = routers.NestedDefaultRouter(modules_router, r'lessons', lookup='lesson')
lessons_router.register(r'steps', StepViewSet, basename='lesson-steps')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(courses_router.urls)),
    path('', include(modules_router.urls)),
    path('', include(lessons_router.urls)),

    path('courses/<int:course_id>/progress/', CourseProgressView.as_view(), name='course-progress'),
    path('user/courses/', UserCoursesView.as_view(), name='user-courses'),

    # Аутентификация и авторизация
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),

    # Прочие маршруты
    path('test/', test_end_point, name='test'),
    path('routes/', get_routes, name='get_routes'),
]
