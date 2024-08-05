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
            return self.avatar
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

    price = models.PositiveIntegerField(default=0, verbose_name='Цена')

    author = models.ForeignKey(User, related_name='courses', on_delete=models.CASCADE, verbose_name='Автор')
    avatar = models.ImageField(blank=True, verbose_name='Аватарка')

    students = models.ManyToManyField(User, related_name='enrolled_courses', blank=True, verbose_name='Студенты')
    favorites = models.ManyToManyField(User, related_name='favorite_courses', blank=True, verbose_name='Избранное')

    def __str__(self):
        return self.title

    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return DEFAULT_COURSE_AVATAR_URL

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'


class Module(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название модуля')
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE, verbose_name='Курс')

    order = models.PositiveIntegerField(default=0, verbose_name='Порядок модуля')  # Поле для хранения порядка модуля

    class Meta:
        ordering = ['order']
        verbose_name = 'Модуль'
        verbose_name_plural = 'Модули'

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
        ('text', 'Текст'),
        ('video', 'Видео'),
        ('question', 'Вопрос'),
    ]

    lesson = models.ForeignKey(Lesson, related_name='steps', on_delete=models.CASCADE, verbose_name='Урок')
    order = models.PositiveIntegerField(verbose_name='Порядок')
    step_type = models.CharField(max_length=10, choices=STEP_TYPES, verbose_name='Тип шага')

    content = models.JSONField(blank=True, null=True, verbose_name='Контент')

    class Meta:
        ordering = ['order']
        verbose_name = 'Шаг'
        verbose_name_plural = 'Шаги'

    def __str__(self):
        return f"Шаг {self.order} - {self.get_step_type_display()}"

    def save(self, *args, **kwargs):
        if self.step_type == 'text':
            if not self.content or 'html' not in self.content:
                raise ValueError("Текстовые шаги должны содержать HTML контент.")
        elif self.step_type == 'video':
            if not self.content or 'video_url' not in self.content:
                raise ValueError("Видео шаги должны содержать URL видео.")
        elif self.step_type == 'question':
            if not self.content or 'question' not in self.content or 'answers' not in self.content:
                raise ValueError("Шаги с вопросами должны содержать текст вопроса и ответы.")
        super().save(*args, **kwargs)


class CourseProgress(models.Model):
    user = models.ForeignKey(User, related_name='course_progress', on_delete=models.CASCADE,
                             verbose_name='Пользователь')
    course = models.ForeignKey(Course, related_name='progress', on_delete=models.CASCADE, verbose_name='Курс')
    current_module = models.ForeignKey(Module, on_delete=models.SET_NULL, null=True, blank=True,
                                       verbose_name='Текущий модуль')
    current_lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True,
                                       verbose_name='Текущий урок')
    current_step = models.ForeignKey(Step, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Текущий шаг')
    completed_steps = models.ManyToManyField(Step, related_name='completed_by', blank=True,
                                             verbose_name='Завершённые шаги')
    completed = models.BooleanField(default=False, verbose_name='Завершён')

    def __str__(self):
        return f"{self.user.username} - {self.course.title} Прогресс"

    def update_progress(self, step):
        if step not in self.completed_steps.all():
            self.completed_steps.add(step)

        self.current_step = step
        self.current_lesson = step.lesson
        self.current_module = step.lesson.module

        all_steps = Step.objects.filter(lesson=self.current_lesson)
        if all_steps.count() == self.completed_steps.filter(lesson=self.current_lesson).count():
            next_lesson = Lesson.objects.filter(module=self.current_module,
                                                order__gt=self.current_lesson.order).order_by('order').first()
            if next_lesson:
                self.current_lesson = next_lesson
                self.current_step = Step.objects.filter(lesson=next_lesson).order_by('order').first()
            else:
                next_module = Module.objects.filter(course=self.course, order__gt=self.current_module.order).order_by(
                    'order').first()
                if next_module:
                    self.current_module = next_module
                    self.current_lesson = Lesson.objects.filter(module=next_module).order_by('order').first()
                    self.current_step = Step.objects.filter(lesson=self.current_lesson).order_by('order').first()
                else:
                    self.completed = True

        self.save()

    def is_course_completed(self):
        all_steps = Step.objects.filter(lesson__module__course=self.course)
        return all_steps.count() == self.completed_steps.count()

    def progress_percentage(self):
        all_steps = Step.objects.filter(lesson__module__course=self.course)
        completed_steps_count = self.completed_steps.count()

        if not all_steps.exists():
            return 0

        return (completed_steps_count / all_steps.count()) * 100

    class Meta:
        verbose_name = 'Прогресс курса'
        verbose_name_plural = 'Прогрессы курсов'


class Certificate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates', verbose_name='Пользователь')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates', verbose_name='Курс')
    file = models.FileField(upload_to='certificates/', verbose_name='Файл')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return f'Сертификат для {self.user} - {self.course.title}'

    class Meta:
        verbose_name = 'Сертификат'
        verbose_name_plural = 'Сертификаты'
