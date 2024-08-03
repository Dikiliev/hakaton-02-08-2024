// components/LessonStepEditor.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField, Grid } from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAxios from '@utils/useAxios';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const LessonStepEditor = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const [steps, setSteps] = useState([]);
    const [stepType, setStepType] = useState('text');
    const [content, setContent] = useState('');
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    const axiosInstance = useAxios();

    useEffect(() => {
        axiosInstance
            .get(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`)
            .then((response) => {
                setSteps(response.data);
            })
            .catch((error) => console.error('Error fetching steps:', error));
    }, [courseId, moduleId, lessonId]);

    const handleAddStep = () => {
        let newStep;
        if (stepType === 'text') {
            newStep = { step_type: stepType, order: steps.length + 1, content: { html: content } };
        } else if (stepType === 'video') {
            newStep = { step_type: stepType, order: steps.length + 1, content: { video_url: content } };
        } else if (stepType === 'question') {
            newStep = { step_type: stepType, order: steps.length + 1, content: { question, answers } };
        }

        axiosInstance
            .post(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`, newStep)
            .then((response) => {
                setSteps([...steps, response.data]);
                clearInputs();
            })
            .catch((error) => console.error('Error adding step:', error));
    };

    const clearInputs = () => {
        setContent('');
        setQuestion('');
        setAnswers(['']);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
        },
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Редактирование урока</Typography>
            <Box sx={{ my: 2, display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <Typography variant="h6">Выберите тип шага:</Typography>
                <Button variant={stepType === 'text' ? 'contained' : 'outlined'} onClick={() => setStepType('text')}>Текст</Button>
                <Button variant={stepType === 'video' ? 'contained' : 'outlined'} onClick={() => setStepType('video')}>Видео</Button>
                <Button variant={stepType === 'question' ? 'contained' : 'outlined'} onClick={() => setStepType('question')}>Вопрос</Button>
            </Box>

            {stepType === 'text' && (
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                />
            )}

            {stepType === 'video' && (
                <Box sx={{ my: 2 }}>
                    <TextField
                        label="URL видео"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                    />
                </Box>
            )}

            {stepType === 'question' && (
                <Box sx={{ my: 2 }}>
                    <TextField
                        label="Вопрос"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6">Ответы:</Typography>
                    {answers.map((answer, index) => (
                        <TextField
                            key={index}
                            label={`Ответ ${index + 1}`}
                            value={answer}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[index] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    ))}
                    <Button variant="outlined" onClick={() => setAnswers([...answers, ''])}>Добавить ответ</Button>
                </Box>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleAddStep}
                sx={{ mt: 2 }}
            >
                Добавить шаг
            </Button>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5">Шаги урока:</Typography>
                {steps.map((step, index) => (
                    <Box key={step.id} sx={{ my: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                        <Typography variant="h6">{`Шаг ${index + 1}: ${step.step_type}`}</Typography>
                        {step.step_type === 'text' && <div dangerouslySetInnerHTML={{ __html: step.content.html }} />}
                        {step.step_type === 'video' && <a href={step.content.video_url} target="_blank" rel="noopener noreferrer">{step.content.video_url}</a>}
                        {step.step_type === 'question' && (
                            <Box>
                                <Typography>{step.content.question}</Typography>
                                <ul>
                                    {step.content.answers.map((ans, idx) => (
                                        <li key={idx}>{ans}</li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default LessonStepEditor;
