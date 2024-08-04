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
import QuestionComponent from "@pages/learnCoursePage/QuestionComponent.jsx";

const LearnCoursePage = () => {
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseModules();
    }, [courseId]);

    const fetchCourseModules = async () => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/modules/`);
            const modulesData = response.data;

            if (modulesData.length > 0) {
                setModules(modulesData);
                // Устанавливаем первый модуль и урок как текущие
                const firstModule = modulesData[0];
                setCurrentModule(firstModule);

                if (firstModule.lessons.length > 0) {
                    const firstLesson = firstModule.lessons[0];
                    setCurrentLesson(firstLesson);
                    await fetchLessonSteps(firstLesson.id, firstModule.id);
                }
            } else {
                resetCourseProgress();
            }
        } catch (error) {
            console.error('Error fetching course modules:', error);
        }
    };

    const fetchLessonSteps = async (lessonId, moduleId) => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`);
            const stepsData = response.data.map(step => ({ ...step, completed: false }));

            if (stepsData.length > 0) {
                await fetchProgress(stepsData);
            } else {
                resetLessonProgress();
            }
        } catch (error) {
            console.error('Error fetching lesson steps:', error);
        }
    };

    const fetchProgress = async (stepsData) => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/progress/`);
            const progressData = response.data;

            const completedStepIds = new Set(progressData.completed_steps.map(step => step));
            setCompletedSteps(completedStepIds);

            const updatedSteps = stepsData.map(step => ({
                ...step,
                completed: completedStepIds.has(step.id)
            }));

            setSteps(updatedSteps);

            const nextStep = findNextStep(updatedSteps);
            setCurrentStep(nextStep);
        } catch (error) {
            console.error('Error fetching course progress:', error);
        }
    };

    const findNextStep = (updatedSteps) => {
        return updatedSteps.find(step => !step.completed) || updatedSteps[0];
    }

    const updateProgress = async (stepId) => {
        try {
            await axiosInstance.post(`/courses/${courseId}/progress/`, { step_id: stepId });
            setCompletedSteps(prev => new Set(prev).add(stepId));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const resetCourseProgress = () => {
        setModules([]);
        setCurrentModule(null);
        setCurrentLesson(null);
        resetLessonProgress();
    };

    const resetLessonProgress = () => {
        setSteps([]);
        setCurrentStep(null);
    };

    const handleModuleClick = (module) => {
        setCurrentModule(module);
        if (module.lessons.length > 0) {
            const firstLesson = module.lessons[0];
            setCurrentLesson(firstLesson);
            fetchLessonSteps(firstLesson.id, module.id);
        } else {
            setCurrentLesson(null);
            resetLessonProgress();
        }
    };

    const handleLessonClick = (lesson) => {
        setCurrentLesson(lesson);
        fetchLessonSteps(lesson.id, currentModule.id);
    };

    const handleStepClick = (step) => {
        setCurrentStep(step);  // Ensure current step is updated when selected
    };

    const handleNextStep = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep.id);
        const nextStep = steps[currentIndex + 1];

        if (nextStep) {
            setCurrentStep(nextStep);
            if (currentStep.step_type !== 'question') {
                updateProgress(currentStep.id);
            }
        } else {
            // Все шаги урока пройдены, переходим к следующему уроку
            handleNextLessonOrModule();
        }
    };

    const handleNextLessonOrModule = () => {
        const currentLessonIndex = currentModule.lessons.findIndex(lesson => lesson.id === currentLesson.id);
        const nextLesson = currentModule.lessons[currentLessonIndex + 1];

        if (nextLesson) {
            setCurrentLesson(nextLesson);
            fetchLessonSteps(nextLesson.id, currentModule.id);
        } else {
            // Все уроки модуля пройдены, переходим к следующему модулю
            const currentModuleIndex = modules.findIndex(module => module.id === currentModule.id);
            const nextModule = modules[currentModuleIndex + 1];

            if (nextModule) {
                setCurrentModule(nextModule);
                const firstLessonOfNextModule = nextModule.lessons[0];
                setCurrentLesson(firstLessonOfNextModule);
                fetchLessonSteps(firstLessonOfNextModule.id, nextModule.id);
            } else {
                // Все модули и уроки курса завершены
                console.log("Course completed");
            }
        }
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
                                    color={step.completed ? 'primary' : currentStep && currentStep.id === step.id ? 'primary' : 'secondary'}
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
                            <QuestionComponent
                                step={currentStep}
                                onCorrectAnswer={() => updateProgress(currentStep.id)}
                            />
                        )}
                    </Box>

                    {/* Next Step Button */}
                    {currentStep && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                onClick={handleNextStep}
                                disabled={currentStep.step_type === 'question' && !completedSteps.has(currentStep.id)}
                            >
                                Далее
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default LearnCoursePage;