// components/LessonStepEditor.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import useAxios from '@utils/useAxios';
import StepTypeSelector from './StepTypeSelector';
import TextStepEditor from './TextStepEditor';
import VideoStepEditor from './VideoStepEditor';
import QuestionStepEditor from './QuestionStepEditor';
import LessonStepsList from './LessonStepsList';

const LessonStepEditor = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const [steps, setSteps] = useState([]);
    const [activeStepIndex, setActiveStepIndex] = useState(null);
    const [stepType, setStepType] = useState('text');
    const [content, setContent] = useState('');
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
    const axiosInstance = useAxios();

    useEffect(() => {
        fetchSteps();
    }, [courseId, moduleId, lessonId]);

    const fetchSteps = async () => {
        try {
            const response = await axiosInstance.get(
                `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`
            );
            setSteps(response.data);
        } catch (error) {
            console.error('Error fetching steps:', error);
        }
    };

    const handleAddStep = () => {
        let newStep;
        if (stepType === 'text') {
            newStep = {
                step_type: stepType,
                order: steps.length + 1,
                content: { html: content },
                lesson: lessonId,
            };
        } else if (stepType === 'video') {
            newStep = {
                step_type: stepType,
                order: steps.length + 1,
                content: { video_url: content },
                lesson: lessonId,
            };
        } else if (stepType === 'question') {
            newStep = {
                step_type: stepType,
                order: steps.length + 1,
                content: { question, answers, correct_answer: correctAnswerIndex },
                lesson: lessonId,
            };
        }

        setSteps([...steps, newStep]);
        clearInputs();
    };

    const handleUpdateStep = (index) => {
        if (activeStepIndex !== null) {
            updateStepContent(); // Ensure previous step content is updated before switching
        }
        setActiveStepIndex(index);
        const step = steps[index];
        setStepType(step.step_type);
        if (step.step_type === 'text') {
            setContent(step.content.html);
        } else if (step.step_type === 'video') {
            setContent(step.content.video_url);
        } else if (step.step_type === 'question') {
            setQuestion(step.content.question);
            setAnswers(step.content.answers);
            setCorrectAnswerIndex(step.content.correct_answer);
        }
    };

    const updateStepContent = () => {
        const updatedSteps = [...steps];
        if (activeStepIndex !== null) {
            if (stepType === 'text') {
                updatedSteps[activeStepIndex].content.html = content;
            } else if (stepType === 'video') {
                updatedSteps[activeStepIndex].content.video_url = content;
            } else if (stepType === 'question') {
                updatedSteps[activeStepIndex].content = { question, answers, correct_answer: correctAnswerIndex };
            }
            setSteps(updatedSteps);
        }
    };

    const handleSaveAllSteps = async () => {
        if (activeStepIndex !== null) {
            updateStepContent(); // Make sure last active step is updated
        }
        try {
            await Promise.all(
                steps.map((step) =>
                    axiosInstance.patch(
                        `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/${step.id}/`,
                        step
                    )
                )
            );
            alert('All steps saved successfully!');
        } catch (error) {
            console.error('Error saving steps:', error);
        }
    };

    const clearInputs = () => {
        setContent('');
        setQuestion('');
        setAnswers(['']);
        setCorrectAnswerIndex(null);
        setActiveStepIndex(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Редактирование урока
            </Typography>
            <LessonStepsList steps={steps} activeStepIndex={activeStepIndex} onStepClick={handleUpdateStep} />
            <StepTypeSelector stepType={stepType} setStepType={setStepType} />
            {activeStepIndex !== null && (
                <>
                    {stepType === 'text' && (
                        <TextStepEditor content={content} setContent={setContent} />
                    )}
                    {stepType === 'video' && (
                        <VideoStepEditor content={content} setContent={setContent} />
                    )}
                    {stepType === 'question' && (
                        <QuestionStepEditor
                            question={question}
                            setQuestion={setQuestion}
                            answers={answers}
                            setAnswers={setAnswers}
                            correctAnswerIndex={correctAnswerIndex}
                            setCorrectAnswerIndex={setCorrectAnswerIndex}
                        />
                    )}
                </>
            )}
            <Button variant="contained" color="primary" onClick={handleAddStep} sx={{ mt: 2 }}>
                Добавить шаг
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSaveAllSteps} sx={{ mt: 2, ml: 2 }}>
                Сохранить все шаги
            </Button>
        </Container>
    );
};

export default LessonStepEditor;
