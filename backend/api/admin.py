from django.contrib import admin
from .models import User, Course, Lesson, TextBlock, ImageBlock, VideoBlock, QuestionBlock, Answer, Tag

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
    list_display = ('title', 'description')
    search_fields = ('title', 'description')
    filter_horizontal = ('tags',)

class TextBlockInline(admin.TabularInline):
    model = TextBlock
    extra = 1

class ImageBlockInline(admin.TabularInline):
    model = ImageBlock
    extra = 1

class VideoBlockInline(admin.TabularInline):
    model = VideoBlock
    extra = 1

class QuestionBlockInline(admin.TabularInline):
    model = QuestionBlock
    extra = 1

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 1

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    search_fields = ('title',)
    inlines = [TextBlockInline, ImageBlockInline, VideoBlockInline, QuestionBlockInline]

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('text', 'question')
    list_filter = ('question',)
    search_fields = ('text',)

@admin.register(TextBlock)
class TextBlockAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'order', 'content')
    list_filter = ('lesson',)
    search_fields = ('content',)

@admin.register(ImageBlock)
class ImageBlockAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'order', 'image_url', 'image_file')
    list_filter = ('lesson',)
    search_fields = ('image_url',)

@admin.register(VideoBlock)
class VideoBlockAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'order', 'video_url', 'video_file')
    list_filter = ('lesson',)
    search_fields = ('video_url',)

@admin.register(QuestionBlock)
class QuestionBlockAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'order', 'question_text')
    list_filter = ('lesson',)
    search_fields = ('question_text',)
    inlines = [AnswerInline]
