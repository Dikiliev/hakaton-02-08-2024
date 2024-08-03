// components/QuestionStepEditor.jsx

import { Box, TextField, Typography, Button, Radio, FormControlLabel, FormControl, FormLabel, RadioGroup } from '@mui/material';

const QuestionStepEditor = ({ question, setQuestion, answers, setAnswers, correctAnswerIndex, setCorrectAnswerIndex }) => (
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
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                    control={
                        <Radio
                            checked={correctAnswerIndex === index}
                            onChange={() => setCorrectAnswerIndex(index)}
                        />
                    }
                    label=""
                />
                <TextField
                    label={`Ответ ${index + 1}`}
                    value={answer}
                    onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                    }}
                    fullWidth
                />
            </Box>
        ))}
        <Button variant="outlined" onClick={() => setAnswers([...answers, ''])}>Добавить ответ</Button>
    </Box>
);

export default QuestionStepEditor;
