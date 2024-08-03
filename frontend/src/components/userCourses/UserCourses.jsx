// components/UserCourses.jsx

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from "@utils/useAxios.js";

const UserCourses = () => {
    const [courses, setCourses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const navigate = useNavigate();
    const axiosInstance = useAxios(); // Используем кастомный хук для получения экземпляра axios

    useEffect(() => {
        axiosInstance
            .get('/courses/')
            .then((response) => {
                setCourses(response.data);
                console.log(response.data);
            })
            .catch((error) => console.error('Error fetching user courses:', error));
    }, []);

    const handleAddCourse = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewCourseTitle('');
        setNewCourseDescription('');
    };

    const handleCreateCourse = () => {
        axiosInstance
            .post('/courses/', {
                title: newCourseTitle,
                description: newCourseDescription,
            })
            .then((response) => {
                setCourses([...courses, response.data]);
                handleCloseDialog();
            })
            .catch((error) => console.error('Error creating course:', error));
    };

    const handleDeleteCourse = (courseId) => {
        axiosInstance
            .delete(`/courses/${courseId}/modules`)
            .then(() => {
                setCourses(courses.filter((course) => course.id !== courseId));
            })
            .catch((error) => console.error('Error deleting course:', error));
    };

    return (
        <Container>
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Мои Курсы
                </Typography>
                <Button variant="contained" color="primary" onClick={handleAddCourse}>
                    Добавить курс
                </Button>
            </Box>
            <Grid container spacing={4}>
                {Array.isArray(courses) && courses.map((course) => (
                    <Grid item xs={12} md={4} key={course.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>
                                <Button size="small" onClick={() => navigate(`/courses/${course.id}/modules`)}>
                                    Редактировать
                                </Button>
                                <Button size="small" color="secondary" onClick={() => handleDeleteCourse(course.id)}>
                                    Удалить
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Диалог для создания нового курса */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Создать новый курс</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название курса"
                        type="text"
                        fullWidth
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Описание курса"
                        type="text"
                        fullWidth
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleCreateCourse} color="primary">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserCourses;
