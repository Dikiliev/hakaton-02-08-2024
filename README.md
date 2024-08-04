# Проект на DRF + Vite React JS

## Описание

Этот проект представляет собой веб-приложение, построенное с использованием Django REST Framework (DRF) для серверной части и Vite с React JS для клиентской части. DRF используется для создания RESTful API, а Vite React JS для создания динамичного пользовательского интерфейса.

## Требования

Перед началом работы убедитесь, что у вас установлены следующие инструменты:

- Python 3.10+
- Node.js 14+
- npm 6+
- Django 4+
- Django REST Framework
- Vite

## Установка

### Серверная часть (Django)

1. Клонируйте репозиторий:

    ```bash
    git clone https://github.com/Dikiliev/hakaton-02-08-2024/
    cd hakaton-02-08-2024
    ```

2. Создайте и активируйте виртуальное окружение:

    ```bash
    python -m venv venv
    source venv/bin/activate   # Для MacOS/Linux
    venv\Scripts\activate      # Для Windows
    ```

3. Установите зависимости:

    ```bash
    pip install -r requirements.txt
    ```

4. Выполните миграции базы данных:

    ```bash
    python manage.py migrate
    ```

5. Запустите сервер разработки:

    ```bash
    python manage.py runserver
    ```

### Клиентская часть (Vite React JS)

1. Перейдите в директорию клиента:

    ```bash
    cd frontend
    ```

2. Установите зависимости:

    ```bash
    npm install
    ```

3. Запустите Vite сервер разработки:

    ```bash
    npm run dev
    ```

## Сборка проекта для продакшена

### Серверная часть

1. Соберите статические файлы:

    ```bash
    python manage.py collectstatic
    ```

2. Настройте конфигурацию вашего веб-сервера для обслуживания статических и медиа файлов.

### Клиентская часть

1. Соберите проект:

    ```bash
    npm run build
    ```

2. Скопируйте собранные файлы в директорию статических файлов Django.

## Использование

После запуска сервера разработки DRF будет доступен по адресу `http://localhost:5173/`, а фронтенд будет доступен по адресу `http://localhost:5173/`.

## Структура проекта

- `backend/` — серверная часть на Django.
- `frontend/` — клиентская часть на Vite React JS.
- `requirements.txt` — файл зависимостей для Python.
- `package.json` — файл зависимостей для Node.js.

## Контакты

Если у вас есть вопросы или предложения, пожалуйста, свяжитесь с нами в телеграм @mdikiy

