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
from .models import User, Course, Module, Lesson, Step, Tag, CourseProgress
from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    CourseSerializer,
    ModuleSerializer,
    LessonSerializer,
    StepSerializer,
    TagSerializer, UpdateProgressSerializer, CourseProgressSerializer
)
import json



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


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['author']

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
        # Получаем все курсы, которые изучает пользователь
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