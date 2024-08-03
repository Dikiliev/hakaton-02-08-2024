from django.db.models import Avg
from rest_framework import serializers

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Course, Lesson, TextBlock, ImageBlock, VideoBlock, QuestionBlock, Answer, Tag


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


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text']


class QuestionBlockSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)
    correct_answer = AnswerSerializer()

    class Meta:
        model = QuestionBlock
        fields = ['id', 'question_text', 'answers', 'correct_answer']


class TextBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextBlock
        fields = ['id', 'content', 'order']


class ImageBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageBlock
        fields = ['id', 'image_url', 'image_file', 'order']


class VideoBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoBlock
        fields = ['id', 'video_url', 'video_file', 'order']


class LessonSerializer(serializers.ModelSerializer):
    text_blocks = TextBlockSerializer(many=True, required=False)
    image_blocks = ImageBlockSerializer(many=True, required=False)
    video_blocks = VideoBlockSerializer(many=True, required=False)
    question_blocks = QuestionBlockSerializer(many=True, required=False)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order', 'text_blocks', 'image_blocks', 'video_blocks', 'question_blocks']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CourseSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)  # Добавляем уроки в сериализатор курса

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'tags', 'author', 'lessons']
