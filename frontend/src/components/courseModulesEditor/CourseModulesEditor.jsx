// src/components/CourseModulesEditor.jsx

import { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, TextField, Box, Paper, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '@utils/useAxios';

const CourseModulesEditor = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [modules, setModules] = useState([]);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [lessonTitles, setLessonTitles] = useState({});

    useEffect(() => {
        axiosInstance.get(`/courses/${courseId}/modules/`)
            .then(response => {
                console.log(response.data);
                const modulesWithLessons = response.data.map(module => ({
                    ...module,
                    lessons: module.lessons || [],
                }));
                setModules(modulesWithLessons);
            })
            .catch(error => console.error('Error fetching modules:', error));
    }, [courseId]);

    const handleAddModule = () => {
        if (!newModuleTitle) {
            alert('Введите название модуля');
            return;
        }

        axiosInstance.post(`/courses/${courseId}/modules/`, { title: newModuleTitle, course: courseId })
            .then(response => {
                setModules([...modules, { ...response.data, lessons: [] }]);
                setNewModuleTitle('');
            })
            .catch(error => {
                console.error('Error creating module:', error);
                alert('Ошибка создания модуля: ' + error.message);
            });
    };

    const handleAddLesson = (moduleId) => {
        const lessonTitle = lessonTitles[moduleId];
        if (!lessonTitle) {
            alert('Введите название урока');
            return;
        }

        const module = modules.find(mod => mod.id === moduleId);
        const maxOrder = module.lessons.reduce((max, lesson) => Math.max(max, lesson.order), 0);

        axiosInstance.post(`/courses/${courseId}/modules/${moduleId}/lessons/`, { title: lessonTitle, order: maxOrder + 1 })
            .then(response => {
                setModules(modules.map(mod =>
                    mod.id === moduleId
                        ? { ...mod, lessons: [...mod.lessons, response.data] }
                        : mod
                ));
                setLessonTitles(prev => ({ ...prev, [moduleId]: '' }));
            })
            .catch(error => {
                console.error('Error creating lesson:', error);
                alert('Ошибка создания урока: ' + error.message);
            });
    };

    const handleLessonTitleChange = (moduleId, value) => {
        setLessonTitles(prev => ({ ...prev, [moduleId]: value }));
    };

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>Редактирование модулей курса</Typography>
            <Button size="small" onClick={() => navigate(`/user-courses`)}>Назад</Button>
            <Box sx={{ my: 2 }}>
                {modules.map(module => (
                    <Paper key={module.id} elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h5" component="div" gutterBottom>
                            {module.title}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Название нового урока"
                                value={lessonTitles[module.id] || ''}
                                onChange={(e) => handleLessonTitleChange(module.id, e.target.value)}
                                variant="outlined"
                                sx={{ mr: 2, mb: 2 }}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddLesson(module.id)}
                            >
                                Добавить урок
                            </Button>
                        </Box>
                        <Typography variant="h6">Уроки:</Typography>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}>
                            {module.lessons.map(lesson => (
                                <Card
                                    key={lesson.id}
                                    variant="outlined"
                                    sx={{
                                        my: 1,
                                        cursor: 'pointer',
                                        borderColor: 'text.primary',
                                        borderRadius: 2,
                                        maxWidth: '400px',
                                    }}
                                    onClick={() => navigate(`/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}/edit`)}
                                >
                                    <CardContent>
                                        <Typography variant="body1">{lesson.title}</Typography>
                                    </CardContent>
                                </Card>

                            ))}
                        </Box>
                    </Paper>
                ))}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <TextField
                        label="Название нового модуля"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2, mb: 2 }}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleAddModule}>
                        Добавить модуль
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CourseModulesEditor;
