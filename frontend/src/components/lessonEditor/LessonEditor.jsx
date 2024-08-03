// components/LessonEditor.jsx

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAxios from '@utils/useAxios';

// Подключаем quill-image-resize-module-react
import ImageResize from 'quill-image-resize-module-react';

// Регистрируем модуль изменения размера изображения в Quill
Quill.register('modules/imageResize', ImageResize);

const LessonEditor = () => {
    // Извлекаем идентификаторы курса и урока из URL
    const { courseId, lessonId } = useParams();

    // Состояния для хранения данных урока и его контента
    const [lesson, setLesson] = useState(null);
    const [content, setContent] = useState('');

    // Используем настроенный axios instance
    const axiosInstance = useAxios();
    const quillRef = useRef(null);

    // Загружаем данные урока при загрузке компонента
    useEffect(() => {
        axiosInstance
            .get(`/courses/${courseId}/lessons/${lessonId}/`)
            .then((response) => {
                setLesson(response.data);
                setContent(response.data.content.html || ''); // Предполагаем, что контент хранится как HTML в JSON
            })
            .catch((error) => console.error('Error fetching lesson details:', error));
    }, [courseId, lessonId]);

    // Обработчик сохранения изменений урока
    const handleSaveContent = () => {
        axiosInstance
            .patch(`/courses/${courseId}/lessons/${lessonId}/`, {
                content: { html: content }, // Отправляем HTML-контент
            })
            .then(() => {
                alert('Урок успешно сохранен!');
            })
            .catch((error) => console.error('Error saving lesson content:', error));
    };

    // Настройки панели инструментов и модулей для редактора
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // Добавление заголовков
            ['bold', 'italic', 'underline', 'strike', 'blockquote'], // Стиль текста
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], // Списки и отступы
            [{ align: [] }], // Выравнивание текста
            [{ color: [] }, { background: [] }], // Цвет текста и фона
            ['link', 'image', 'video'], // Вставка ссылок, изображений и видео
            ['clean'], // Очистка форматирования
        ],
        imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar'], // Настройки модуля изменения размера изображения
        },
    };

    return (
        <Container>
            {lesson && (
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        {lesson.title}
                    </Typography>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent} // Обновляем контент при изменении
                        modules={modules}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveContent} // Сохранение контента
                        sx={{ mt: 2 }}
                    >
                        Сохранить изменения
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default LessonEditor;
