// components/CoursePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Container, Typography, Box, Card, CardContent, Button, Grid, Divider} from '@mui/material';
import useAxios from '@utils/useAxios';
import {DEFAULT_COURSE_AVATAR_URL} from "@utils/constants.js";
import axios from "@utils/axios.js";

const CoursePage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]); // New state for modules
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseDetails();
        fetchCourseModules(); // Fetch modules when component mounts
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`/courses/${courseId}/`);
            setCourse(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };

    const fetchCourseModules = async () => {
        try {
            const response = await axios.get(`/courses/${courseId}/modules/`);
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching course modules:', error);
        }
    };

    if (!course) {
        return <Typography>Загрузка...</Typography>;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button size="small" onClick={() => navigate(`/courses`)}>
                    Назад к курсам
                </Button>
            </Box>
            <Divider sx={{mt: 5}}></Divider>

            {/* Course Header Section */}
            <Grid container spacing={2} sx={{ mb: 4, backgroundColor: 'background.paper', borderRadius: 2, p: 2, }}>
                <Grid item xs={12} md={8} sx={{ pr: {xl: 12, sm: 4, xs: 0} }}>
                    <Typography variant="h4" gutterBottom color="white">{course.title}</Typography>
                    <Typography variant="body1" gutterBottom color="white">{course.description}</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                        src={course.avatar || DEFAULT_COURSE_AVATAR_URL} // Use a default image if none is provided
                        alt={course.title}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Course Modules and Lessons Plan */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>План курса</Typography>
                    {(modules || []).map((module, moduleIndex) => (
                        <Card key={module.id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{moduleIndex + 1}. {module.title}</Typography>
                                <Box spacing={2} sx={{ mt: 2 }}>
                                    {(module.lessons || []).map((lesson, lessonIndex) => (
                                        <Grid key={lesson.id}>
                                            <Card
                                                variant="outlined"
                                                sx={{ cursor: 'pointer', height: '100%' }}
                                                onClick={() => navigate(`/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`)}
                                            >
                                                <CardContent>
                                                    <Typography variant="body1">{moduleIndex + 1}.{lessonIndex + 1} {lesson.title}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>

                {/* Course Price and Purchase Panel */}
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6">Цена: {course.price || 'Бесплатно'}</Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Купить курс
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Container>
    );
};

export default CoursePage;
