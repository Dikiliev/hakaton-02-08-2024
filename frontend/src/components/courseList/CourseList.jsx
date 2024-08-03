// components/CourseList.jsx

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/courses/')
            .then(response => setCourses(response.data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    const handleAddCourse = () => {
        // Логика добавления курса
    };

    return (
        <Container>
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h4" gutterBottom>Курсы</Typography>
                <Button variant="contained" color="primary" onClick={handleAddCourse}>
                    Добавить курс
                </Button>
            </Box>
            <Grid container spacing={4}>
                {courses.map(course => (
                    <Grid item xs={12} md={4} key={course.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                >
                                    Подробнее
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CourseList;
