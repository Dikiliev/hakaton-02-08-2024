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

    price = models.PositiveIntegerField(default=0)

    author = models.ForeignKey(User, related_name='courses', on_delete=models.CASCADE, verbose_name='Автор')
    avatar = models.ImageField(blank=True, verbose_name='Аватарка')

    students = models.ManyToManyField(User, related_name='enrolled_courses', blank=True, verbose_name='Студенты')
    favorites = models.ManyToManyField(User, related_name='favorite_courses', blank=True, verbose_name='Избранное')

    def __str__(self):
        return self.title

    def get_avatar_url(self):
        if self.avatar.url:
            return self.avatar
        return DEFAULT_COURSE_AVATAR_URL

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'


class Module(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название модуля')
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE, verbose_name='Курс')

    def __str__(self):
        return f"{self.title} ({self.course.title})"


class Lesson(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название урока')
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE, verbose_name='Модуль')
    order = models.PositiveIntegerField(verbose_name='Порядок')

    class Meta:
        ordering = ['order']
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'

    def __str__(self):
        return self.title


class Step(models.Model):
    STEP_TYPES = [
        ('text', 'Text'),
        ('video', 'Video'),
        ('question', 'Question'),
    ]

    lesson = models.ForeignKey(Lesson, related_name='steps', on_delete=models.CASCADE, verbose_name='Урок')
    order = models.PositiveIntegerField(verbose_name='Порядок')
    step_type = models.CharField(max_length=10, choices=STEP_TYPES, verbose_name='Тип шага')

    content = models.JSONField(blank=True, null=True, verbose_name='Контент')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Step {self.order} - {self.get_step_type_display()}"

    def save(self, *args, **kwargs):
        if self.step_type == 'text':
            if not self.content or 'html' not in self.content:
                raise ValueError("Text steps must have HTML content.")
        elif self.step_type == 'video':
            if not self.content or 'video_url' not in self.content:
                raise ValueError("Video steps must have a video URL.")
        elif self.step_type == 'question':
            if not self.content or 'question' not in self.content or 'answers' not in self.content:
                raise ValueError("Question steps must have question text and answers.")
        super().save(*args, **kwargs)


class CourseProgress(models.Model):
    user = models.ForeignKey(User, related_name='course_progress', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='progress', on_delete=models.CASCADE)
    current_module = models.ForeignKey(Module, on_delete=models.SET_NULL, null=True, blank=True)
    current_lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True)
    current_step = models.ForeignKey(Step, on_delete=models.SET_NULL, null=True, blank=True)
    completed_steps = models.ManyToManyField(Step, related_name='completed_by', blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.course.title} Progress"

    def update_progress(self, step):
        """
        Обновляет прогресс до указанного шага.
        Отмечает шаг как завершенный и обновляет текущий модуль, урок и шаг.
        """
        # Добавляем шаг в список завершенных, если он еще не был добавлен
        if step not in self.completed_steps.all():
            self.completed_steps.add(step)

        # Обновляем текущий шаг, урок и модуль
        self.current_step = step
        self.current_lesson = step.lesson
        self.current_module = step.lesson.module

        # Проверяем, завершены ли все шаги текущего урока
        lesson_steps = Step.objects.filter(lesson=self.current_lesson)
        completed_lesson_steps = lesson_steps.filter(id__in=self.completed_steps.all())

        if completed_lesson_steps.count() == lesson_steps.count():
            # Все шаги текущего урока завершены, переходим к следующему уроку
            next_lesson = Lesson.objects.filter(
                module=self.current_module,
                order__gt=self.current_lesson.order
            ).order_by('order').first()

            if next_lesson:
                self.current_lesson = next_lesson
                # Обновляем текущий шаг на первый шаг следующего урока
                self.current_step = Step.objects.filter(lesson=next_lesson).order_by('order').first()
            else:
                # Все уроки в текущем модуле завершены, переходим к следующему модулю
                next_module = Module.objects.filter(
                    course=self.course,
                    order__gt=self.current_module.order
                ).order_by('order').first()

                if next_module:
                    self.current_module = next_module
                    self.current_lesson = Lesson.objects.filter(module=next_module).order_by('order').first()
                    self.current_step = Step.objects.filter(lesson=self.current_lesson).order_by('order').first()
                else:
                    # Все модули и уроки курса завершены
                    self.completed = True

        self.save()

    def is_course_completed(self):
        """
        Проверяет, завершены ли все шаги курса.
        """
        all_steps = Step.objects.filter(lesson__module__course=self.course)
        return all_steps.count() == self.completed_steps.count()
