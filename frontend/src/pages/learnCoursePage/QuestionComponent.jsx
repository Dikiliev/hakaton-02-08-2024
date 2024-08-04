// Component to handle question step
import {Box, Button, Typography} from "@mui/material";
import {useState} from "react";

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

export default QuestionComponent