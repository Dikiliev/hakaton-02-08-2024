from django.contrib import admin
from .models import User, Course, Module, Lesson, Step, Tag

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role')
    list_filter = ('role',)
    search_fields = ('username', 'email', 'first_name', 'last_name')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'description')
    search_fields = ('title', 'description', 'author__username')
    filter_horizontal = ('tags',)

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course')
    list_filter = ('course',)
    search_fields = ('title', 'course__title')

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order')
    list_filter = ('module',)
    search_fields = ('title', 'module__title')

@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'step_type', 'order')
    list_filter = ('step_type', 'lesson')
    search_fields = ('lesson__title',)
