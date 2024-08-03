from django.db.models import Avg
from rest_framework import serializers

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Course, Lesson, Tag, Step, Module


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
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', '')
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
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'tags', 'author', 'lessons', 'avatar_url']

    def get_avatar_url(self, obj):
        return obj.get_avatar_url()


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'lesson', 'order', 'step_type', 'content']

    def validate_content(self, value):
        step_type = self.initial_data.get('step_type')
        if step_type == 'text' and 'html' not in value:
            raise serializers.ValidationError("Text steps must have HTML content.")
        if step_type == 'video' and 'video_url' not in value:
            raise serializers.ValidationError("Video steps must have a video URL.")
        if step_type == 'question':
            if 'question_text' not in value or 'answers' not in value:
                raise serializers.ValidationError("Question steps must have question text and answers.")
        return value
