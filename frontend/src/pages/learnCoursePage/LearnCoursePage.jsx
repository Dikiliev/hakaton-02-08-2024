// components/LearnCoursePage.jsx

import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
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
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const axiosInstance = useAxios();

    useEffect(() => {
        fetchCourseModules();
    }, [courseId]);

    useEffect(() => {
        if (modules.length > 0) {
            const currentModule = modules[currentModuleIndex];
            if (currentModule && currentModule.lessons.length > 0) {
                const currentLesson = currentModule.lessons[currentLessonIndex];
                if (currentLesson) {
                    fetchLessonSteps(currentLesson.id, currentModule.id);
                }
            }
        }
    }, [modules, currentModuleIndex, currentLessonIndex]);

    useEffect(() => {
        fetchProgress();
    }, [modules]);

    const fetchCourseModules = async () => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/modules/`);
            setModules(response.data);
            // await fetchProgress();
        } catch (error) {
            console.error('Error fetching course modules:', error);
        }
    };

    const fetchLessonSteps = async (lessonId, moduleId) => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`);
            const stepsData = response.data;
            setSteps(stepsData);
        } catch (error) {
            console.error('Error fetching lesson steps:', error);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/progress/`);
            const progressData = response.data;

            const completedStepIds = new Set(progressData.completed_steps.map(step => step));
            setCompletedSteps(completedStepIds);
            // Find the last completed step and determine the next step, lesson, and module
            let foundCurrentStep = false;
            for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
                const module = modules[moduleIndex];
                for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
                    const lesson = module.lessons[lessonIndex];
                    const response = await axiosInstance.get(`/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}/steps/`);
                    const stepsData = response.data;

                    for (let stepIndex = 0; stepIndex < stepsData.length; stepIndex++) {
                        const step = stepsData[stepIndex];
                        if (!completedStepIds.has(step.id)) {
                            setCurrentModuleIndex(moduleIndex);
                            setCurrentLessonIndex(lessonIndex);
                            setCurrentStepIndex(stepIndex);
                            foundCurrentStep = true;
                            break;
                        }
                    }

                    if (foundCurrentStep) break;
                }
                if (foundCurrentStep) break;
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const updateProgress = async (stepId) => {
        try {
            await axiosInstance.post(`/courses/${courseId}/progress/`, { step_id: stepId });
            setCompletedSteps(prev => new Set(prev).add(stepId));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleNextStep = () => {
        const currentStep = steps[currentStepIndex];
        if (currentStep.step_type !== 'question') {
            updateProgress(currentStep.id);
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            handleNextLessonOrModule();
        }
    };

    const handleNextLessonOrModule = () => {
        if (currentLessonIndex < modules[currentModuleIndex].lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setCurrentStepIndex(0);
        } else if (currentModuleIndex < modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
            setCurrentLessonIndex(0);
            setCurrentStepIndex(0);
        } else {
            navigate(`/courses/${courseId}/completion`)
        }
    };

    const handleModuleClick = (moduleIndex) => {
        setCurrentModuleIndex(moduleIndex);
        setCurrentLessonIndex(0);
        setCurrentStepIndex(0);
    };

    const handleLessonClick = (lessonIndex, moduleIndex) => {
        setCurrentModuleIndex(moduleIndex);
        setCurrentLessonIndex(lessonIndex);
        setCurrentStepIndex(0);
    };

    const handleStepClick = (stepIndex) => {
        setCurrentStepIndex(stepIndex);
    };

    const currentModule = modules[currentModuleIndex] || {};
    const currentLesson = currentModule.lessons ? currentModule.lessons[currentLessonIndex] : {};
    const currentStep = steps[currentStepIndex] || {};

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
                        {modules.map((module, moduleIndex) => (
                            <React.Fragment key={module.id}>
                                <ListItem
                                    button
                                    selected={currentModuleIndex === moduleIndex}
                                    onClick={() => handleModuleClick(moduleIndex)}
                                >
                                    <ListItemText primary={`${moduleIndex + 1}. ${module.title}`} />
                                </ListItem>
                                {(
                                    <List component="div" disablePadding>
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <ListItem
                                                button
                                                key={lesson.id}
                                                selected={currentModuleIndex === moduleIndex && currentLessonIndex === lessonIndex}
                                                sx={{ pl: 4 }}
                                                onClick={() => handleLessonClick(lessonIndex, moduleIndex)}
                                            >
                                                <ListItemText primary={`${moduleIndex + 1}.${lessonIndex + 1} ${lesson.title}`} />
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
                                    variant={currentStepIndex === index ? 'contained' : 'outlined'}
                                    onClick={() => handleStepClick(index)}
                                    color={completedSteps.has(step.id) ? 'primary' : 'secondary'}
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
                        {currentStep.step_type === 'text' && (
                            <Typography dangerouslySetInnerHTML={{ __html: currentStep.content.html }} />
                        )}
                        {currentStep.step_type === 'video' && (
                            <Box component="video" controls sx={{ width: '100%' }}>
                                <source src={currentStep.content.video_url} type="video/mp4" />
                                Ваш браузер не поддерживает видео.
                            </Box>
                        )}
                        {currentStep.step_type === 'question' && (
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
