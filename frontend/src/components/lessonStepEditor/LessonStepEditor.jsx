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
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const axiosInstance = useAxios();

    useEffect(() => {
        fetchSteps();
    }, [courseId, moduleId, lessonId]);

    const fetchSteps = async () => {
        try {
            const response = await axiosInstance.get(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`);
            setSteps(response.data);
        } catch (error) {
            console.error('Error fetching steps:', error);
        }
    };

    const handleSaveAllSteps = async () => {
        try {
            await Promise.all(
                steps.map((step) => {
                    let content;
                    switch (step.step_type) {
                        case 'text':
                            content = { html: step.content.html || '' };
                            break;
                        case 'video':
                            content = { video_url: step.content.video_url || '' };
                            break;
                        case 'question':
                            content = {
                                question: step.content.question || '',
                                answers: step.content.answers || [],
                                correct_answer: step.content.correct_answer || 0
                            };
                            break;
                        default:
                            throw new Error('Invalid step type');
                    }

                    return axiosInstance.patch(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/${step.id}/`, {
                        step_type: step.step_type,
                        content
                    });
                })
            );
            alert('Все шаги успешно сохранены!');
        } catch (error) {
            console.error('Error saving steps:', error);
        }
    };

    const updateStepContent = (index, content) => {
        setSteps((prevSteps) => {
            const updatedSteps = [...prevSteps];
            updatedSteps[index].content = content;
            return updatedSteps;
        });
    };

    const handleStepTypeChange = (index, stepType) => {
        setSteps((prevSteps) => {
            const updatedSteps = [...prevSteps];
            updatedSteps[index].step_type = stepType;
            updatedSteps[index].content = getDefaultContent(stepType); // Reset content to default for the new type
            return updatedSteps;
        });
    };

    const getDefaultContent = (stepType) => {
        switch (stepType) {
            case 'text':
                return { html: '' };
            case 'video':
                return { video_url: '' };
            case 'question':
                return { question: '', answers: [], correct_answer: 0 };
            default:
                return {};
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Редактирование урока</Typography>
            <LessonStepsList steps={steps} activeStepIndex={activeStepIndex} onStepClick={setActiveStepIndex} />
            <StepTypeSelector
                stepType={steps[activeStepIndex]?.step_type}
                setStepType={(newType) => handleStepTypeChange(activeStepIndex, newType)}
            />
            {steps[activeStepIndex]?.step_type === 'text' && (
                <TextStepEditor
                    content={steps[activeStepIndex].content.html}
                    setContent={(html) => updateStepContent(activeStepIndex, { html })}
                />
            )}
            {steps[activeStepIndex]?.step_type === 'video' && (
                <VideoStepEditor
                    content={steps[activeStepIndex].content.video_url}
                    setContent={(video_url) => updateStepContent(activeStepIndex, { video_url })}
                />
            )}
            {steps[activeStepIndex]?.step_type === 'question' && (
                <QuestionStepEditor
                    question={steps[activeStepIndex].content.question}
                    setQuestion={(question) => updateStepContent(activeStepIndex, { ...steps[activeStepIndex].content, question })}
                    answers={steps[activeStepIndex].content.answers}
                    setAnswers={(answers) => updateStepContent(activeStepIndex, { ...steps[activeStepIndex].content, answers })}
                    correctAnswerIndex={steps[activeStepIndex].content.correct_answer}
                    setCorrectAnswerIndex={(correct_answer) => updateStepContent(activeStepIndex, { ...steps[activeStepIndex].content, correct_answer })}
                />
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAllSteps}
                sx={{ mt: 2 }}
            >
                Сохранить все шаги
            </Button>
        </Container>
    );
};

export default LessonStepEditor;
