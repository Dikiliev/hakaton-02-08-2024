import os
import django

# Убедитесь, что переменная среды DJANGO_SETTINGS_MODULE указывает на настройки вашего проекта
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Инициализируйте Django
django.setup()

from api.models import User, Tag, Course, Module, Lesson, Step, UserRole

# Шаг 1: Создать или выбрать пользователя
author, created = User.objects.get_or_create(
    username='alex_k',
    defaults={
        'email': 'alex_k@example.com',
        'role': UserRole.TEACHER.value[0],
        'first_name': 'Алекс',
        'last_name': 'Ковалев'
    }
)

# Шаг 2: Создать теги
tag_names = ['HTML', 'Веб-разработка', 'Frontend']
tags = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]

# Шаг 3: Создать курс
course, created = Course.objects.get_or_create(
    title='Основы HTML для начинающих',
    defaults={
        'description': 'Курс по основам HTML, охватывающий создание структуры веб-страниц и работу с элементами.',
        'author': author,
        'price': 1000
    }
)
course.tags.set(tags)

# Шаг 4: Создать первый модуль
module1 = Module.objects.create(
    title='Основные элементы HTML',
    course=course,
    order=0
)

# Создать уроки для первого модуля
lesson_titles_module1 = [
    'Введение в HTML',
    'Элементы и атрибуты',
    'Работа с текстом'
]

lessons_module1 = [Lesson.objects.create(title=title, module=module1, order=index) for index, title in enumerate(lesson_titles_module1)]

# Ссылка на видео для всех шагов с видео
default_video_url = 'https://www.youtube.com/embed/salY_Sm6mv4?si=xVM6qf4ItW5CqmRc'

# Создать шаги для каждого урока в первом модуле
steps_data_module1 = {
    'Введение в HTML': [
        ('text', {'html': '<p>HTML — это язык разметки, используемый для создания структуры веб-страниц.</p>'}),
        ('video', {'video_url': default_video_url}),
        ('question', {
            'question': 'Что такое HTML?',
            'answers': ['Язык программирования', 'Язык разметки', 'Язык стилей', 'Все перечисленное'],
            'correct_answer': 'Язык разметки'
        }),
        ('text', {'html': '<p>HTML состоит из элементов, которые представляют различные части веб-страницы.</p>'}),
    ],
    'Элементы и атрибуты': [
        ('text', {'html': '<p>Элементы HTML используются для создания различных структур веб-страницы, таких как заголовки, параграфы и ссылки.</p>'}),
        ('video', {'video_url': default_video_url}),
        ('question', {
            'question': 'Что такое атрибуты в HTML?',
            'answers': ['Свойства элементов', 'Стили элементов', 'Теги', 'Все перечисленное'],
            'correct_answer': 'Свойства элементов'
        }),
        ('text', {'html': '<p>Атрибуты добавляют информацию об элементах, например, класс, идентификатор и стиль.</p>'}),
    ],
    'Работа с текстом': [
        ('text', {'html': '<p>HTML позволяет форматировать текст с помощью различных тегов, таких как <strong>, <em> и <p>.</p>'}),
        ('video', {'video_url': default_video_url}),
        ('question', {
            'question': 'Какие теги используются для форматирования текста в HTML?',
            'answers': ['<strong>', '<em>', '<p>', 'Все перечисленное'],
            'correct_answer': 'Все перечисленное'
        }),
        ('text', {'html': '<p>Форматирование текста позволяет сделать его более выразительным и удобочитаемым.</p>'}),
    ],
}

for lesson in lessons_module1:
    step_data = steps_data_module1.get(lesson.title, [])
    for index, (step_type, content) in enumerate(step_data):
        Step.objects.create(lesson=lesson, order=index, step_type=step_type, content=content)

# Шаг 5: Создать второй модуль
module2 = Module.objects.create(
    title='Продвинутые концепции HTML',
    course=course,
    order=1
)

# Создать уроки для второго модуля
lesson_titles_module2 = [
    'Списки и таблицы',
    'Мультимедийные элементы',
    'Формы и ввод данных'
]

lessons_module2 = [Lesson.objects.create(title=title, module=module2, order=index) for index, title in enumerate(lesson_titles_module2)]

# Создать шаги для каждого урока во втором модуле
steps_data_module2 = {
    'Списки и таблицы': [
        ('text', {'html': '<p>HTML предоставляет теги для создания упорядоченных и неупорядоченных списков, а также таблиц для организации данных.</p>'}),
        ('video', {'video_url': default_video_url}),
        ('question', {
            'question': 'Какие теги используются для создания списков в HTML?',
            'answers': ['<ul>', '<ol>', '<li>', 'Все перечисленное'],
            'correct_answer': 'Все перечисленное'
        }),
        ('text', {'html': '<p>Списки и таблицы помогают структурировать информацию на веб-странице.</p>'}),
    ],
    'Мультимедийные элементы': [
        ('text', {'html': '<p>HTML позволяет добавлять мультимедийные элементы, такие как изображения, аудио и видео, на веб-страницу.</p>'}),
        ('video', {'video_url': default_video_url}),
        ('question', {
            'question': 'Какие теги используются для добавления мультимедиа в HTML?',
            'answers': ['<img>', '<audio>', '<video>', 'Все перечисленное'],
            'correct_answer': 'Все перечисленное'
        }),
        ('text', {'html': '<p>Мультимедийные элементы делают веб-страницы более интерактивными и привлекательными.</p>'}),
    ],
    'Формы и ввод данных': [
        ('text', {'html': '<p>HTML предоставляет теги для создания форм и обработки пользовательского ввода данных.</p>'}),
        ('video', {'video_url': default_video_url}),
        ('question', {
            'question': 'Какие элементы используются для создания форм в HTML?',
            'answers': ['<form>', '<input>', '<textarea>', 'Все перечисленное'],
            'correct_answer': 'Все перечисленное'
        }),
        ('text', {'html': '<p>Формы позволяют собирать информацию от пользователей и отправлять её на сервер.</p>'}),
    ],
}

for lesson in lessons_module2:
    step_data = steps_data_module2.get(lesson.title, [])
    for index, (step_type, content) in enumerate(step_data):
        Step.objects.create(lesson=lesson, order=index, step_type=step_type, content=content)

print("Курс по HTML успешно создан!")
