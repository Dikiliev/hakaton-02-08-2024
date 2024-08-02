from django.db import models
from django.contrib.auth.models import AbstractUser
from enum import Enum
from rest_framework.exceptions import ValidationError


class UserRole(Enum):
    USER = 1, 'Пользователь'
    TEACHER = 2, 'Преподаватель'
    MANAGER = 3, 'Менеджер'


class User(AbstractUser):
    ROLE_ENUM = [(role.value[0], role.value[1]) for role in UserRole]

    DEFAULT_AVATAR_URL = 'https://abrakadabra.fun/uploads/posts/2021-12/1640528661_1-abrakadabra-fun-p-serii-chelovek-na-avu-1.png'

    role = models.IntegerField(
        choices=ROLE_ENUM,
        default=UserRole.USER.value[0],
        verbose_name='Роль'
    )

    avatar = models.ImageField(
        blank=True,
        verbose_name='Аватарка'
    )

    phone_number = models.CharField(
        max_length=25,
        blank=True,
        verbose_name='Номер телефона'
    )

    def __str__(self):
        return f'{self.get_full_name()} [{self.username}] ({dict(self.ROLE_ENUM).get(self.role, "Неизвестная роль")})'

    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return self.DEFAULT_AVATAR_URL

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Имя')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'


class Course(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    tags = models.ManyToManyField(Tag, related_name='courses', blank=True, verbose_name='Теги')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'


class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE, verbose_name='Курс')
    title = models.CharField(max_length=255, verbose_name='Название')
    order = models.PositiveIntegerField(verbose_name='Порядок')

    class Meta:
        ordering = ['order']
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'

    def __str__(self):
        return self.title


class ContentBlock(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='content_blocks', on_delete=models.CASCADE, verbose_name='Урок')
    order = models.PositiveIntegerField(verbose_name='Порядок')

    class Meta:
        abstract = True
        ordering = ['order']


class TextBlock(ContentBlock):
    lesson = models.ForeignKey(Lesson, related_name='text_blocks', on_delete=models.CASCADE, verbose_name='Урок')
    content = models.TextField(verbose_name='Содержание')

    def __str__(self):
        return f"Текст: {self.content[:30]}"

    class Meta:
        verbose_name = 'Текстовый блок'
        verbose_name_plural = 'Текстовые блоки'


class ImageBlock(ContentBlock):
    lesson = models.ForeignKey(Lesson, related_name='image_blocks', on_delete=models.CASCADE, verbose_name='Урок')
    image_url = models.URLField(blank=True, null=True, verbose_name='URL изображения')
    image_file = models.ImageField(upload_to='images/', blank=True, null=True, verbose_name='Файл изображения')

    def __str__(self):
        if self.image_file:
            return f"Изображение: {self.image_file.url}"
        return f"URL изображения: {self.image_url}"

    def clean(self):
        if not self.image_file and not self.image_url:
            raise ValidationError('Необходимо предоставить либо файл изображения, либо URL изображения.')

    def save(self, *args, **kwargs):
        if self.image_file and self.image_url:
            self.image_url = None
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Изображение'
        verbose_name_plural = 'Изображения'


class VideoBlock(ContentBlock):
    lesson = models.ForeignKey(Lesson, related_name='video_blocks', on_delete=models.CASCADE, verbose_name='Урок')
    video_url = models.URLField(blank=True, null=True, verbose_name='URL видео')
    video_file = models.FileField(upload_to='videos/', blank=True, null=True, verbose_name='Файл видео')

    def __str__(self):
        if self.video_file:
            return f"Видео: {self.video_file.url}"
        return f"URL видео: {self.video_url}"

    def clean(self):
        if not self.video_file and not self.video_url:
            raise ValidationError('Необходимо предоставить либо файл видео, либо URL видео.')

    def save(self, *args, **kwargs):
        if self.video_file and self.video_url:
            self.video_url = None
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Видео'
        verbose_name_plural = 'Видео'


class Answer(models.Model):
    text = models.TextField(verbose_name='Текст ответа')
    question = models.ForeignKey('QuestionBlock', related_name='answers', on_delete=models.CASCADE, verbose_name='Вопрос')

    def __str__(self):
        return self.text[:50]

    class Meta:
        verbose_name = 'Ответ'
        verbose_name_plural = 'Ответы'


class QuestionBlock(ContentBlock):
    lesson = models.ForeignKey(Lesson, related_name='question_blocks', on_delete=models.CASCADE, verbose_name='Урок')
    question_text = models.TextField(verbose_name='Текст вопроса')
    correct_answer = models.ForeignKey(Answer, related_name='correct_for', on_delete=models.CASCADE, null=True, blank=True, verbose_name='Правильный ответ')

    def __str__(self):
        return f"Вопрос: {self.question_text[:30]}"

    def clean(self):
        super().clean()
        if self.correct_answer and self.correct_answer.question != self:
            raise ValidationError('Правильный ответ должен быть одним из ответов на этот вопрос.')

    def save(self, *args, **kwargs):
        if not self.pk and not self.correct_answer:
            raise ValidationError('Необходимо указать правильный ответ.')
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Вопрос'
        verbose_name_plural = 'Вопросы'
