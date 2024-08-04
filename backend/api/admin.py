from django.contrib import admin
from .models import User, Tag, Course, Module, Lesson, Step, CourseProgress

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'get_full_name')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('role',)
    ordering = ('username',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'get_student_count', 'get_favorite_count')
    search_fields = ('title', 'description')
    list_filter = ('tags', 'author')
    filter_horizontal = ('tags', 'students', 'favorites')

    def get_student_count(self, obj):
        return obj.students.count()
    get_student_count.short_description = 'Number of Students'

    def get_favorite_count(self, obj):
        return obj.favorites.count()
    get_favorite_count.short_description = 'Number of Favorites'

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    search_fields = ('title',)
    list_filter = ('course',)
    ordering = ('course', 'order')

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order')
    search_fields = ('title',)
    list_filter = ('module',)
    ordering = ('module', 'order')

@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'lesson', 'step_type', 'order')
    search_fields = ('lesson__title', 'step_type')
    list_filter = ('lesson', 'step_type')
    ordering = ('lesson', 'order')

@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'current_module', 'current_lesson', 'current_step', 'completed')
    search_fields = ('user__username', 'course__title')
    list_filter = ('completed', 'course')

    def get_completed_step_count(self, obj):
        return obj.completed_steps.count()
    get_completed_step_count.short_description = 'Completed Steps Count'

# Customize admin site headers and titles
admin.site.site_header = "Course Management Admin"
admin.site.site_title = "Course Management Portal"
admin.site.index_title = "Welcome to the Course Management Portal"
