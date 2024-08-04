import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from django.conf import settings

from datetime import datetime

# Регистрация шрифта
pdfmetrics.registerFont(TTFont('DejaVuSans', 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', 'DejaVuSans-Bold.ttf'))

offset = 100
offsetY = 100

def generate_certificate(user, course, background_image_path):
    # Путь к файлу сертификата
    certificates_dir = os.path.join(settings.MEDIA_ROOT, 'certificates')
    os.makedirs(certificates_dir, exist_ok=True)  # Создание директории, если не существует

    certificate_filename = f'certificates/{user.username}_{course.id}_certificate.pdf'
    file_path = os.path.join(settings.MEDIA_ROOT, certificate_filename)

    # Устанавливаем ориентацию страницы на альбомную
    page_size = landscape(letter)
    c = canvas.Canvas(file_path, pagesize=page_size)
    width, height = page_size

    # Добавляем фоновое изображение
    c.drawImage(background_image_path, 0, 0, width=width, height=height)

    # Заголовок сертификата
    c.setFont('DejaVuSans', 30)
    c.setFillColorRGB(0, 0, 0)  # Черный цвет текста
    c.drawCentredString(width / 2.0 + offset, height - 100 - offsetY, "СЕРТИФИКАТ")

    # Основной текст сертификата
    c.setFont('DejaVuSans', 20)
    c.drawCentredString(width / 2.0 + offset, height - 180 - offsetY, "Настоящий сертификат подтверждает, что")

    # Имя студента жирным шрифтом
    c.setFont('DejaVuSans-Bold', 30)
    c.drawCentredString(width / 2.0 + offset, height - 220 - offsetY, user.get_full_name())

    # Текст о завершении курса
    c.setFont('DejaVuSans', 20)
    c.drawCentredString(width / 2.0 + offset, height - 280 - offsetY, "успешно завершил/а курс")

    # Название курса жирным шрифтом
    c.setFont('DejaVuSans-Bold', 30)
    c.drawCentredString(width / 2.0 + offset, height - 320 - offsetY, course.title)

    # Добавление ссылки внизу страницы
    c.setFont('DejaVuSans', 12)
    c.drawString(30, 30, "https://escience.ru")

    # Добавление даты внизу справа
    date_str = datetime.now().strftime("%d.%m.%Y")
    c.drawRightString(width - 30, 30, date_str)

    c.save()

    return certificate_filename
