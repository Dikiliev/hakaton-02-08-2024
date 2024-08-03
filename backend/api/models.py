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


DEFAULT_COURSE_AVATAR_URL = 'https://www.petbehaviourcompany.co.uk/images/default-course-thumbnail.png'
class Course(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    tags = models.ManyToManyField(Tag, related_name='courses', blank=True, verbose_name='Теги')

    author = models.ForeignKey(User, related_name='courses', on_delete=models.CASCADE, verbose_name='Автор')
    avatar = models.ImageField(blank=True, verbose_name='Аватарка')

    def __str__(self):
        return self.title

    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return DEFAULT_COURSE_AVATAR_URL

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'


class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE, verbose_name='Курс')
    title = models.CharField(max_length=255, verbose_name='Название')
    order = models.PositiveIntegerField(verbose_name='Порядок')
    content = models.JSONField(default=dict, verbose_name='Контент урока')

    avatar = models.ImageField(blank=True, verbose_name='Аватарка')

    class Meta:
        ordering = ['order']
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'

    def __str__(self):
        return self.title