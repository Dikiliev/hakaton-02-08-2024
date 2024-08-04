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
    const [selectedStep, setSelectedStep] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseModules();
    }, [courseId]);
    
    useEffect(() => {
        const updatedSteps = steps.map(step => ({
            ...step,
            completed: completedSteps.has(step.id)
        }));

        setSteps(updatedSteps);
    }, [completedSteps])

    const fetchCourseModules = async () => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/modules/`);
            const modulesData = response.data;

            if (modulesData.length > 0) {
                setModules(modulesData);
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

            const nextStep = updatedSteps.find(step => !step.completed) || updatedSteps[0];
            setCurrentStep(nextStep);
            setSelectedStep(nextStep);
        } catch (error) {
            console.error('Error fetching course progress:', error);
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

    const resetCourseProgress = () => {
        setModules([]);
        setCurrentModule(null);
        setCurrentLesson(null);
        resetLessonProgress();
    };

    const resetLessonProgress = () => {
        setSteps([]);
        setCurrentStep(null);
        setSelectedStep(null);
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
        setSelectedStep(step);
        setCurrentStep(step);  // Ensure current step is updated when selected
    };

    const handleNextStep = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep.id);
        const nextStep = steps[currentIndex + 1];

        if (nextStep) {
            setCurrentStep(nextStep);
            setSelectedStep(nextStep);
            // Mark the step as completed if it is not a question
            if (currentStep.step_type !== 'question') {
                updateProgress(currentStep.id);
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
                        {selectedStep && selectedStep.step_type === 'text' && (
                            <Typography dangerouslySetInnerHTML={{ __html: selectedStep.content.html }} />
                        )}
                        {selectedStep && selectedStep.step_type === 'video' && (
                            <Box component="video" controls sx={{ width: '100%' }}>
                                <source src={selectedStep.content.video_url} type="video/mp4" />
                                Ваш браузер не поддерживает видео.
                            </Box>
                        )}
                        {selectedStep && selectedStep.step_type === 'question' && (
                            <QuestionComponent
                                step={selectedStep}
                                onCorrectAnswer={() => updateProgress(selectedStep.id)}
                            />
                        )}
                    </Box>

                    {/* Next Step Button */}
                    {selectedStep && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                onClick={handleNextStep}
                                disabled={selectedStep.step_type === 'question' && !completedSteps.has(selectedStep.id)}
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

// Component to handle question step
const QuestionComponent = ({ step, onCorrectAnswer }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState('');

    const handleAnswerSelect = (index) => {
        setSelectedAnswer(index);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === step.content.correct_answer) {
            setFeedback('Верно!');
            onCorrectAnswer(); // Notify that the answer is correct
        } else {
            setFeedback('Попробуйте снова.');
        }
    };

    return (
        <Box>
            <Typography variant="h6">{step.content.question}</Typography>
            <ul>
                {step.content.answers.map((answer, idx) => (
                    <li key={idx}>
                        <Button
                            variant={selectedAnswer === idx ? 'contained' : 'outlined'}
                            onClick={() => handleAnswerSelect(idx)}
                        >
                            {answer}
                        </Button>
                    </li>
                ))}
            </ul>
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                Подтвердить
            </Button>
            {feedback && <Typography variant="body2" color="secondary">{feedback}</Typography>}
        </Box>
    );
};

export default LearnCoursePage;