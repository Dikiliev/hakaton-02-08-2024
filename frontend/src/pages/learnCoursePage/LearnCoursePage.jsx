// components/LearnCoursePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography,
    Button,
    Divider
} from '@mui/material';
import useAxios from '@utils/useAxios';

const LearnCoursePage = () => {
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseModules();
    }, [courseId]);

    const fetchCourseModules = async () => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/modules/`);
            const modulesData = response.data;

            // Проверяем, есть ли модули и уроки
            if (modulesData.length > 0) {
                setModules(modulesData);
                const firstModule = modulesData[0];
                setCurrentModule(firstModule);

                if (firstModule.lessons.length > 0) {
                    const firstLesson = firstModule.lessons[0];
                    setCurrentLesson(firstLesson);
                    fetchLessonSteps(firstLesson.id);
                }
            } else {
                setModules([]);
                setCurrentModule(null);
                setCurrentLesson(null);
                setSteps([]);
                setCurrentStep(null);
            }
        } catch (error) {
            console.error('Error fetching course modules:', error);
        }
    };

    const fetchLessonSteps = async (lessonId) => {
        try {
            if (!currentModule || !lessonId) {
                console.warn('Нет текущего модуля или урока для загрузки шагов.');
                return;
            }

            const response = await axiosInstance.get(`/courses/${courseId}/modules/${currentModule.id}/lessons/${lessonId}/steps/`);
            const stepsData = response.data;

            if (stepsData.length > 0) {
                setSteps(stepsData);
                setCurrentStep(stepsData[0]);
            } else {
                setSteps([]);
                setCurrentStep(null);
            }
        } catch (error) {
            console.error('Error fetching lesson steps:', error);
        }
    };

    const handleModuleClick = (module) => {
        setCurrentModule(module);
        if (module.lessons.length > 0) {
            const firstLesson = module.lessons[0];
            setCurrentLesson(firstLesson);
            fetchLessonSteps(firstLesson.id);
        } else {
            setCurrentLesson(null);
            setSteps([]);
            setCurrentStep(null);
        }
    };

    const handleLessonClick = (lesson) => {
        setCurrentLesson(lesson);
        fetchLessonSteps(lesson.id);
    };

    const handleStepClick = (step) => {
        setCurrentStep(step);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {/* Left Panel for Modules and Lessons */}
                <Grid item xs={12} md={3}>
                    <Typography variant="h6" gutterBottom>
                        Модули и Уроки
                    </Typography>
                    <Divider />
                    <List>
                        {modules.map((module) => (
                            <React.Fragment key={module.id}>
                                <ListItem
                                    button
                                    selected={currentModule && currentModule.id === module.id}
                                    onClick={() => handleModuleClick(module)}
                                >
                                    <ListItemText primary={module.title} />
                                </ListItem>
                                {currentModule && currentModule.id === module.id && (
                                    <List component="div" disablePadding>
                                        {module.lessons.map((lesson) => (
                                            <ListItem
                                                button
                                                key={lesson.id}
                                                selected={currentLesson && currentLesson.id === lesson.id}
                                                sx={{ pl: 4 }}
                                                onClick={() => handleLessonClick(lesson)}
                                            >
                                                <ListItemText primary={lesson.title} />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Grid>

                {/* Right Area for Learning Content */}
                <Grid item xs={12} md={9}>
                    {/* Steps Navigation */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Шаги
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {steps.map((step, index) => (
                                <Button
                                    key={step.id}
                                    variant={currentStep && currentStep.id === step.id ? 'contained' : 'outlined'}
                                    onClick={() => handleStepClick(step)}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Current Step Content */}
                    <Box
                        className="course-content"
                        sx={{
                            mt: 4,
                            p: 2,
                            border: '1px solid',
                            borderRadius: 2,
                            borderColor: 'divider',
                            '& img': {
                                maxWidth: '100%',
                                height: 'auto',
                            },
                        }}
                    >
                        {currentStep && currentStep.step_type === 'text' && (
                            <Typography dangerouslySetInnerHTML={{ __html: currentStep.content.html }} />
                        )}
                        {currentStep && currentStep.step_type === 'video' && (
                            <Box component="video" controls sx={{ width: '100%' }}>
                                <source src={currentStep.content.video_url} type="video/mp4" />
                                Ваш браузер не поддерживает видео.
                            </Box>
                        )}
                        {currentStep && currentStep.step_type === 'question' && (
                            <Box>
                                <Typography variant="h6">{currentStep.content.question}</Typography>
                                <ul>
                                    {currentStep.content.answers.map((answer, idx) => (
                                        <li key={idx}>{answer}</li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LearnCoursePage;
