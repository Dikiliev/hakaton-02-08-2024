// components/CourseCompletionPage.jsx

import { useState, useEffect } from 'react';
import {Box, Container, Typography, Button, Divider} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useAxios from '@utils/useAxios';
import styles from './CourseCompletionPage.module.css';

const CourseCompletionPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Запрос на сервер для получения данных курса
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get(`/courses/${courseId}/`);
                setCourse(response.data);
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Ошибка при загрузке данных курса.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, axiosInstance]);

    // Функция для загрузки сертификата
    const handleDownloadCertificate = () => {
        // Логика для загрузки сертификата, например, через API
        console.log('Downloading certificate...');
    };

    if (loading) {
        return <Typography>Загрузка данных...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container sx={{ mt: 4, textAlign: 'center' }}>


            <Box sx={{ mt: 6 }}>
                <Box className={styles.iconContainer}>
                    <CheckCircleIcon
                        sx={{
                            fontSize: 120,
                            color: 'primary.main',
                        }}
                    />
                </Box>
                <Typography variant="h4" gutterBottom>
                    Поздравляем с успешным завершением курса!
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Вы отлично поработали и теперь можете получить ваш сертификат.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadCertificate}
                    >
                        Скачать сертификат
                    </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/courses')}
                    >
                        Вернуться к курсам
                    </Button>
                </Box>
                <Divider sx={{ mt: 4 }} />
                {course && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                            p: 2,
                            backgroundColor: 'background.paper',

                            m: 'auto',
                            width: 'max-content'
                        }}
                    >
                        <img
                            src={course.avatar || '/path/to/default/image.jpg'}
                            alt={course.title}
                            style={{
                                width: '400px',
                                height: 'auto',

                            }}
                        />
                        <Typography variant="h5">{course.title}</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default CourseCompletionPage;
