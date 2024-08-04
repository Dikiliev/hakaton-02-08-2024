// components/MyLearningPage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '@utils/useAxios';
import {DEFAULT_COURSE_AVATAR_URL} from "@utils/constants.js";

const MyLearningPage = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [completedCourses, setCompletedCourses] = useState([]);
    const [ongoingCourses, setOngoingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/user/courses/');
            const { completed, ongoing } = response.data;
            setCompletedCourses(completed);
            setOngoingCourses(ongoing);

            console.log(completed);
            console.log(ongoing);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Ошибка при загрузке курсов.');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}/learn`);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Мое обучение
            </Typography>
            {loading ? (
                <Typography>Загрузка курсов...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    {/* Ongoing Courses */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Текущие курсы
                        </Typography>
                        <Grid container spacing={3}>
                            {ongoingCourses.map((course) => (
                                <Grid item xs={12} md={4} key={course.id}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={course.avatar || DEFAULT_COURSE_AVATAR_URL}
                                            alt={course.title}
                                        />
                                        <CardContent>
                                            <Typography variant="h6">{course.title}</Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ mt: 2 }}
                                                onClick={() => handleCourseClick(course.id)}
                                            >
                                                Продолжить обучение
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Completed Courses */}
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Завершенные курсы
                        </Typography>
                        <Grid container spacing={3}>
                            {completedCourses.map((course) => (
                                <Grid item xs={12} md={4} key={course.id}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={course.avatar || DEFAULT_COURSE_AVATAR_URL}
                                            alt={course.title}
                                        />
                                        <CardContent>
                                            <Typography variant="h6">{course.title}</Typography>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                sx={{ mt: 2 }}
                                                onClick={() => navigate(`/courses/${course.id}/completion`)}
                                            >
                                                Посмотреть сертификат
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default MyLearningPage;
