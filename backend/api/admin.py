from django.contrib import admin
from .models import User, Tag, Course, Module, Lesson, Step, CourseProgress, Certificate


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'get_full_name')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('role',)
    ordering = ('username',)
    verbose_name = "Пользователь"
    verbose_name_plural = "Пользователи"


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    verbose_name = "Тег"
    verbose_name_plural = "Теги"


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'get_student_count', 'get_favorite_count')
    search_fields = ('title', 'description')
    list_filter = ('tags', 'author')
    filter_horizontal = ('tags', 'students', 'favorites')
    verbose_name = "Курс"
    verbose_name_plural = "Курсы"

    def get_student_count(self, obj):
        return obj.students.count()
    get_student_count.short_description = 'Количество студентов'

    def get_favorite_count(self, obj):
        return obj.favorites.count()
    get_favorite_count.short_description = 'Количество в избранном'


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    search_fields = ('title',)
    list_filter = ('course',)
    ordering = ('course', 'order')
    verbose_name = "Модуль"
    verbose_name_plural = "Модули"


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order')
    search_fields = ('title',)
    list_filter = ('module',)
    ordering = ('module', 'order')
    verbose_name = "Урок"
    verbose_name_plural = "Уроки"


@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'lesson', 'step_type', 'order')
    search_fields = ('lesson__title', 'step_type')
    list_filter = ('lesson', 'step_type')
    ordering = ('lesson', 'order')
    verbose_name = "Шаг"
    verbose_name_plural = "Шаги"


@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'current_module', 'current_lesson', 'current_step', 'completed')
    search_fields = ('user__username', 'course__title')
    list_filter = ('completed', 'course')
    verbose_name = "Прогресс курса"
    verbose_name_plural = "Прогрессы курсов"

    def get_completed_step_count(self, obj):
        return obj.completed_steps.count()
    get_completed_step_count.short_description = 'Количество завершенных шагов'


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'created_at')
    search_fields = ('user__username', 'course__title')
    list_filter = ('created_at',)
    verbose_name = "Сертификат"
    verbose_name_plural = "Сертификаты"


admin.site.site_header = "Администрирование курса"
admin.site.site_title = "Панель управления курсом"
admin.site.index_title = "Добро пожаловать в панель управления курсом"
