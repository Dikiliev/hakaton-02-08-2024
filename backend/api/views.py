import os

from django.http import FileResponse
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from config import settings
from .models import User, Course, Module, Lesson, Step, Tag, CourseProgress, Certificate
from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    CourseSerializer,
    ModuleSerializer,
    LessonSerializer,
    StepSerializer,
    TagSerializer, UpdateProgressSerializer, CourseProgressSerializer, UserUpdateSerializer
)
import json

from .utils import generate_certificate


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
        '/api/test/'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def test_end_point(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        try:
            body = request.body.decode('utf-8')
            data = json.loads(body)
            if 'text' not in data:
                return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)
            text = data.get('text')
            data = f'Congratulation your API just responded to POST request with text: {text}'
            return Response({'response': data}, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)
    return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)


class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return self.request.user


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['author']

    def get_queryset(self):
        queryset = Course.objects.all()
        user = self.request.user

        # Проверяем наличие параметра "owned" в запросе
        owned = self.request.query_params.get('owned', None)

        if owned == 'true' and user.is_authenticated:
            # Возвращаем только курсы, автором которых является текущий пользователь
            queryset = queryset.filter(author=user)

        return queryset


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        course.students.add(request.user)
        return Response({'status': 'enrolled'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def purchase(self, request, pk=None):
        course = self.get_object()
        course.students.add(request.user)
        return Response({'status': 'purchased'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        course = self.get_object()
        if request.user in course.favorites.all():
            course.favorites.remove(request.user)
            return Response({'status': 'removed from favorites'}, status=status.HTTP_200_OK)
        else:
            course.favorites.add(request.user)
            return Response({'status': 'added to favorites'}, status=status.HTTP_200_OK)

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        return Module.objects.filter(course__id=course_id)

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_pk')
        course = get_object_or_404(Course, id=course_id)
        serializer.save(course=course)


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        module_id = self.kwargs.get('module_pk')
        return Lesson.objects.filter(module__id=module_id)

    def perform_create(self, serializer):
        module_id = self.kwargs.get('module_pk')
        module = get_object_or_404(Module, id=module_id)
        serializer.save(module=module)


class StepViewSet(viewsets.ModelViewSet):
    serializer_class = StepSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        lesson_id = self.kwargs.get('lesson_pk')
        return Step.objects.filter(lesson_id=lesson_id)

    def perform_create(self, serializer):
        lesson_id = self.kwargs.get('lesson_pk')
        lesson = Lesson.objects.get(id=lesson_id)
        serializer.save(lesson=lesson)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CourseProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            progress, created = CourseProgress.objects.get_or_create(user=request.user, course=course)
            serializer = CourseProgressSerializer(progress)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, course_id):
        serializer = UpdateProgressSerializer(data=request.data)
        if serializer.is_valid():
            step = serializer.validated_data['step_id']
            progress, created = CourseProgress.objects.get_or_create(user=request.user, course=step.lesson.module.course)
            progress.update_progress(step)
            return Response({'status': 'Progress updated.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        ongoing_progress = CourseProgress.objects.filter(user=request.user, completed=False)
        completed_progress = CourseProgress.objects.filter(user=request.user, completed=True)

        ongoing_courses = [progress.course for progress in ongoing_progress]
        completed_courses = [progress.course for progress in completed_progress]

        ongoing_courses_serialized = CourseSerializer(ongoing_courses, many=True, context={'request': request}).data
        completed_courses_serialized = CourseSerializer(completed_courses, many=True, context={'request': request}).data

        return Response({
            'ongoing': ongoing_courses_serialized,
            'completed': completed_courses_serialized
        })


class CertificateGenerateView(APIView):
    def post(self, request, course_id):
        user = request.user
        course = get_object_or_404(Course, id=course_id)

        # Проверьте, не был ли уже сгенерирован сертификат
        if Certificate.objects.filter(user=user, course=course).exists():
            return Response({"error": "Сертификат уже сгенерирован."}, status=status.HTTP_400_BAD_REQUEST)

        # Путь к фоновому изображению
        background_image = os.path.join(settings.STATIC_ROOT, 'images\\background.jpg')

        # Генерация сертификата
        certificate_path = generate_certificate(user, course, background_image)

        # Сохранение сертификата в базе данных
        Certificate.objects.create(user=user, course=course, file=certificate_path)

        return Response({"success": "Сертификат успешно создан."}, status=status.HTTP_201_CREATED)


class CertificateDownloadView(APIView):
    def get(self, request, certificate_id):
        certificate = get_object_or_404(Certificate, id=certificate_id, user=request.user)

        # Убедитесь, что файл сертификата существует
        if certificate.file and certificate.file.path:
            return FileResponse(open(certificate.file.path, 'rb'), as_attachment=True,
                                filename=os.path.basename(certificate.file.path))
        return Response({"error": "Файл сертификата не найден."}, status=404)


class CertificateDetailView(APIView):
    def get(self, request, course_id):
        user = request.user
        course = get_object_or_404(Course, id=course_id)

        certificate = Certificate.objects.filter(user=user, course=course).first()
        if certificate:
            return Response({
                'id': certificate.id,
                'file': certificate.file.url
            }, status=status.HTTP_200_OK)

        return Response({"error": "Сертификат не найден."}, status=status.HTTP_404_NOT_FOUND)


