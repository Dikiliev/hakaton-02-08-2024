// components/CourseDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import useAxios from '@utils/useAxios';

const CourseDetail = () => {
    const { courseId } = useParams(); // Получаем ID курса из URL
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]); // Инициализируем как пустой массив
    const [openDialog, setOpenDialog] = useState(false);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const navigate = useNavigate();
    const axiosInstance = useAxios(); // Используем кастомный хук для запросов

    useEffect(() => {
        // Загружаем курс и его уроки
        axiosInstance
            .get(`/courses/${courseId}/`)
            .then((response) => {
                setCourse(response.data);
                setLessons(response.data.lessons || []); // Убедимся, что всегда устанавливаем массив
            })
            .catch((error) => console.error('Error fetching course details:', error));
    }, [courseId]);

    const handleAddLesson = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewLessonTitle('');
    };

    const handleCreateLesson = () => {
        axiosInstance
            .post(`/courses/${courseId}/lessons/`, {
                title: newLessonTitle,
                order: lessons.length + 1, // Порядок урока
            })
            .then((response) => {
                setLessons([...lessons, response.data]);
                handleCloseDialog();
            })
            .catch((error) => console.error('Error creating lesson:', error));
    };

    const handleDeleteLesson = (lessonId) => {
        axiosInstance
            .delete(`/courses/${courseId}/lessons/${lessonId}/`)  // Убедитесь, что URL правильный
            .then(() => {
                setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
            })
            .catch((error) => console.error('Error deleting lesson:', error));
    };

    return (
        <Container>
            {course && (
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        {course.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {course.description}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleAddLesson}>
                        Добавить урок
                    </Button>
                    <List sx={{ mt: 2 }}>
                        {lessons.map((lesson) => (
                            <ListItem key={lesson.id} button onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}>
                                <ListItemText primary={lesson.title} />
                                <Button size="small" color="secondary" onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}>
                                    Удалить
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Диалог для создания нового урока */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Создать новый урок</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название урока"
                        type="text"
                        fullWidth
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleCreateLesson} color="primary">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CourseDetail;
