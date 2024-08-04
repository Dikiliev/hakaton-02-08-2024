from django.db.models import Avg
from rest_framework import serializers

from django.contrib.auth.password_validation import validate_password
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import User, Course, Lesson, Tag, Step, Module, CourseProgress


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order']

    def validate_content(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Content must be a valid JSON object.")
        return value


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'course', 'lessons']

    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("Название модуля не может быть пустым.")
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class CourseSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()  # Custom field for favorite status
    is_enrolled = serializers.SerializerMethodField()  # Custom field for enrollment status
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'tags', 'author', 'lessons', 'avatar', 'avatar_url', 'is_favorite', 'is_enrolled']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_is_favorite(self, obj):
        # Check if the course is in the user's favorites
        request = self.context.get('request')
        if request and request.user.is_authenticated:

            return request.user in obj.favorites.all()
        return False

    def get_is_enrolled(self, obj):
        # Check if the user is enrolled in the course
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.students.all()
        return False


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'lesson', 'order', 'step_type', 'content']

    def validate_content(self, value):
        step_type = self.initial_data.get('step_type')

        if step_type == 'text':
            if not isinstance(value, dict) or 'html' not in value or not value['html'].strip():
                raise serializers.ValidationError("Text steps must have HTML content.")

        elif step_type == 'video':
            if not isinstance(value, dict) or 'video_url' not in value or not value['video_url'].strip():
                raise serializers.ValidationError("Video steps must have a valid video URL.")

        elif step_type == 'question':
            if not isinstance(value, dict):
                raise serializers.ValidationError("Question steps must have content in JSON format.")
        else:
            raise serializers.ValidationError("Invalid step type specified.")

        return value


class CourseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseProgress
        fields = ['current_module', 'current_lesson', 'current_step', 'completed_steps']

class UpdateProgressSerializer(serializers.Serializer):
    step_id = serializers.IntegerField()

    def validate_step_id(self, value):
        try:
            return Step.objects.get(id=value)
        except Step.DoesNotExist:
            raise serializers.ValidationError("Step does not exist.")