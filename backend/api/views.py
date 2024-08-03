from rest_framework import viewsets, generics

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
import json

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Course, Lesson, TextBlock, ImageBlock, VideoBlock, QuestionBlock, Tag, Answer
from .serializers import CourseSerializer, LessonSerializer, TextBlockSerializer, ImageBlockSerializer, VideoBlockSerializer, QuestionBlockSerializer, TagSerializer, AnswerSerializer


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
    filterset_fields = ['author']  # Позволяем фильтровать по автору

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Фильтруем уроки по курсу
        course_id = self.kwargs['course_pk']  # Используем course_pk для доступа к ID курса
        return Lesson.objects.filter(course_id=course_id)

    def perform_create(self, serializer):
        # Устанавливаем курс для урока
        course_id = self.kwargs['course_pk']
        course = Course.objects.get(id=course_id)
        serializer.save(course=course)


class TextBlockViewSet(viewsets.ModelViewSet):
    queryset = TextBlock.objects.all()
    serializer_class = TextBlockSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ImageBlockViewSet(viewsets.ModelViewSet):
    queryset = ImageBlock.objects.all()
    serializer_class = ImageBlockSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class VideoBlockViewSet(viewsets.ModelViewSet):
    queryset = VideoBlock.objects.all()
    serializer_class = VideoBlockSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class QuestionBlockViewSet(viewsets.ModelViewSet):
    queryset = QuestionBlock.objects.all()
    serializer_class = QuestionBlockSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]