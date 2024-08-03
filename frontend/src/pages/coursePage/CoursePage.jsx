import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Grid,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import useAxios from '@utils/useAxios';
import { DEFAULT_COURSE_AVATAR_URL } from "@utils/constants.js";
import axios from "@utils/axios.js";
import {useAuthStore} from "@store/auth.js";

const CoursePage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]); // New state for modules
    const [isFavorite, setIsFavorite] = useState(false); // Track if the course is in favorites
    const [open, setOpen] = useState(false); // State for dialog open/close
    const [isEnrolled, setIsEnrolled] = useState(false); // Track enrollment status
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    useEffect(() => {
        fetchCourseDetails();
        fetchCourseModules();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            if (isLoggedIn()){
                const response = await axiosInstance.get(`/courses/${courseId}/`);
                setCourse(response.data);

                setIsFavorite(response.data.is_favorite || false);
                setIsEnrolled(response.data.is_enrolled || false);
            }
            else{
                const response = await axios.get(`/courses/${courseId}/`);
                setCourse(response.data);

                setIsFavorite(false);
                setIsEnrolled(false);
            }

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

    const handleEnroll = async () => {
        try {
            // Add the user to the course's students
            await axiosInstance.post(`/courses/${courseId}/enroll/`);
            navigate(`/courses/${courseId}/learn`);
            setIsEnrolled(true); // Mark the user as enrolled
        } catch (error) {
            console.error('Error enrolling in the course:', error);
        }
    };

    const handlePurchase = async () => {
        try {
            // Simulate purchase process
            await axiosInstance.post(`/courses/${courseId}/purchase/`);
            navigate(`/courses/${courseId}/learn`);
            setOpen(false); // Close the dialog
            setIsEnrolled(true); // Mark the user as enrolled
        } catch (error) {
            console.error('Error purchasing the course:', error);
        }
    };

    const handleAddToFavorites = async () => {
        try {
            const response = await axiosInstance.post(`/courses/${courseId}/favorite/`);
            console.log('Updated favorite status:', response.data);
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
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
            <Divider sx={{ mt: 5 }}></Divider>

            {/* Course Header Section */}
            <Grid container spacing={2} sx={{
                mb: 4,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                p: 2,
                color: 'text.primary' // Ensure text color uses the defined palette
            }}>
                <Grid item xs={12} md={8} sx={{ pr: { xl: 12, sm: 4, xs: 0 } }}>
                    <Typography variant="h4" gutterBottom>{course.title}</Typography>
                    <Typography variant="body1" gutterBottom>{course.description}</Typography>
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
                            {isEnrolled ? (
                                <Typography variant="h6" color="primary.main">
                                    Вы уже записаны на курс
                                </Typography>
                            ) : (
                                <Typography variant="h6">
                                    Цена:{" "}
                                    <Box component="span" sx={{ color: "primary.main" }}>
                                        {course.price === 0 ? "Бесплатно" : `${course.price} ₽`}
                                    </Box>
                                </Typography>
                            )}
                            {isEnrolled ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate(`/courses/${courseId}/learn`)}
                                >
                                    Перейти к обучению
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleOpenDialog}
                                >
                                    {course.price === 0 ? 'Поступить' : 'Купить курс'}
                                </Button>
                            )}
                            <Button
                                variant={isFavorite ? "contained" : "outlined"}
                                color={isFavorite ? "secondary" : "primary"}
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleAddToFavorites}
                            >
                                {isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Enrollment or Purchase Confirmation Dialog */}
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{course.price === 0 ? "Подтверждение поступления" : "Подтверждение покупки"}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {course.price === 0
                            ? "Вы уверены, что хотите поступить на этот курс?"
                            : `Вы уверены, что хотите купить этот курс за ${course.price} ₽?`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Отмена</Button>
                    <Button onClick={course.price === 0 ? handleEnroll : handlePurchase} color="primary">
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CoursePage;
