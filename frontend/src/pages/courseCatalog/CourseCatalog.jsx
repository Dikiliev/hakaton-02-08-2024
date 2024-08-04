// components/CourseCatalog.jsx

import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '@utils/useAxios.js';
import {DEFAULT_COURSE_AVATAR_URL} from "@utils/constants.js";
import axios from "@utils/axios.js";

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('/courses/');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleViewCourse = (courseId) => {
        // Перенаправляем пользователя на страницу подробной информации о курсе
        navigate(`/courses/${courseId}`);
    };

    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
                Каталог курсов
            </Typography>
            <Grid container spacing={4}>
                {courses.map((course) => (
                    <Grid item key={course.id} xs={12} sm={6} md={4}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={course.avatar || DEFAULT_COURSE_AVATAR_URL} // Изображение курса или плейсхолдер
                                alt={course.title}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {course.title}
                                </Typography>
                                <Typography>
                                    {course.description.substring(0, 100)}... {/* Обрезаем длинные описания */}
                                </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
                                <Button size={'small'} variant="contained" sx={{width: '80%'}} onClick={() => handleViewCourse(course.id)}>
                                    Перейти
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CourseCatalog;
