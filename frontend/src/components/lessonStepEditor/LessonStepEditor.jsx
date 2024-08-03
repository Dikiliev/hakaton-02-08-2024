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
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const LessonStepEditor = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const [steps, setSteps] = useState([]);
    const [stepType, setStepType] = useState('text');
    const [content, setContent] = useState('');
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null); // New state
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

    const handleAddStep = async () => {
        // Validation for question steps
        if (stepType === 'question' && (!question.trim() || answers.length === 0 || answers.includes('') || correctAnswerIndex === null)) {
            alert('Please provide both the question, answers, and select a correct answer.');
            return;
        }

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
                content: { question, answers, correct_answer: correctAnswerIndex }, // Include correct answer index
                lesson: lessonId,
            };
        }

        try {
            const response = await axiosInstance.post(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`, newStep);
            setSteps([...steps, response.data]);
            clearInputs();
        } catch (error) {
            console.error('Error adding step:', error);
        }
    };

    const clearInputs = () => {
        setContent('');
        setQuestion('');
        setAnswers(['']);
        setCorrectAnswerIndex(null); // Clear correct answer selection
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Редактирование урока</Typography>
            <StepTypeSelector stepType={stepType} setStepType={setStepType} />
            {stepType === 'text' && <TextStepEditor content={content} setContent={setContent} />}
            {stepType === 'video' && <VideoStepEditor content={content} setContent={setContent} />}
            {stepType === 'question' && (
                <QuestionStepEditor
                    question={question}
                    setQuestion={setQuestion}
                    answers={answers}
                    setAnswers={setAnswers}
                    correctAnswerIndex={correctAnswerIndex}
                    setCorrectAnswerIndex={setCorrectAnswerIndex} // Pass down the state
                />
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddStep}
                sx={{ mt: 2 }}
            >
                Добавить шаг
            </Button>
            <LessonStepsList steps={steps} />
        </Container>
    );
};

export default LessonStepEditor;
