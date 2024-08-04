// Component to handle question step
import {Box, Button, Typography} from "@mui/material";
import {useEffect, useState} from "react";

const correctInfo = 'Верно!'

const QuestionComponent = ({ step, onCorrectAnswer }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState('');

    const handleAnswerSelect = (index) => {
        if (feedback === correctInfo) return;
        setSelectedAnswer(index);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === step.content.correct_answer || step.content.answers[selectedAnswer] === step.content.correct_answer) {
            setFeedback(correctInfo);
            onCorrectAnswer();
        } else {
            setFeedback('Попробуйте снова.');
            setSelectedAnswer(null)
        }
    };

    return (
        <Box>

            <Typography variant="h6">{step.content.question}</Typography>

            <Typography variant="body2">Выберите правильный вариант ответа</Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '200px' }}>
                {step.content.answers.map((answer, idx) => (
                    <>
                        <Button
                            key={idx}
                            variant={selectedAnswer === idx ? 'contained' : 'outlined'}
                            onClick={() => handleAnswerSelect(idx)}
                        >
                            {answer}
                        </Button>
                    </>
                ))}
            </Box>
            <Button sx={{mt: 2}} onClick={handleSubmitAnswer} disabled={selectedAnswer === null || feedback === correctInfo}>
                Подтвердить
            </Button>
            {feedback && <Typography variant="body2" color={feedback === correctInfo ? 'primary' : 'secondary'}>{feedback}</Typography>}
        </Box>
    );
};

export default QuestionComponent