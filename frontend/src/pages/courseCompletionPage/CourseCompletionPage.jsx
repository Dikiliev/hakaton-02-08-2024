import { useState, useEffect } from 'react';
import {Box, Container, Typography, Button, Divider, LinearProgress, CircularProgress} from '@mui/material';
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
    const [certificate, setCertificate] = useState(null); // Состояние для хранения данных о сертификате

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
    }, [courseId]);

    // Запрос на сервер для проверки существования сертификата
    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const response = await axiosInstance.get(`/certificates/${courseId}/`);
                setCertificate(response.data);
                console.log(response.data);
            } catch (err) {
                console.error('Ошибка при загрузке сертификата:', err);
                setCertificate(null);

                try {
                    const response = await axiosInstance.post(`/generate-certificate/${courseId}/`);
                    setCertificate(response.data);
                    console.log('Сертификат успешно создан');

                    try {
                        const response = await axiosInstance.get(`/certificates/${courseId}/`);
                        setCertificate(response.data);
                        console.log(response.data);
                    } catch (err) {
                        console.error('Ошибка при загрузке сертификата:', err);
                        setCertificate(null);
                    }
                } catch (err) {
                    console.error('Ошибка при создании сертификата:', err);
                }
            }
        };

        fetchCertificate();
    }, [courseId]);

    // Функция для создания или скачивания сертификата
    const handleCertificateAction = async () => {
        if (certificate) {
            // Если сертификат существует, скачиваем его
            try {
                const response = await axiosInstance.get(`/download-certificate/${certificate.id}/`, {
                    responseType: 'blob', // Важно указать, чтобы axios знал, что ожидается blob-данные
                });

                // Создаем URL для blob-данных и симулируем клик по ссылке для скачивания
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'certificate.pdf');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } catch (err) {
                console.error('Ошибка при скачивании сертификата:', err);
            }
        } else {
            // Если сертификата нет, создаем его
            try {
                const response = await axiosInstance.post(`/generate-certificate/${courseId}/`);
                setCertificate(response.data); // Обновляем состояние с новыми данными сертификата
                console.log('Сертификат успешно создан');
            } catch (err) {
                console.error('Ошибка при создании сертификата:', err);
            }
        }
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
                    {
                        certificate ?
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCertificateAction}
                            >
                                Скачать сертификат
                            </Button>
                            :
                            <CircularProgress  color="primary" />
                    }
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
