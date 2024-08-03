// components/StepTypeSelector.jsx

import React from 'react';
import { Typography, Button, Box } from '@mui/material';

const StepTypeSelector = ({ stepType, setStepType }) => (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        <Typography variant="h6">Выберите тип шага:</Typography>
        <Button variant={stepType === 'text' ? 'contained' : 'outlined'} onClick={() => setStepType('text')}>
            Текст
        </Button>
        <Button variant={stepType === 'video' ? 'contained' : 'outlined'} onClick={() => setStepType('video')}>
            Видео
        </Button>
        <Button variant={stepType === 'question' ? 'contained' : 'outlined'} onClick={() => setStepType('question')}>
            Вопрос
        </Button>
    </Box>
);

export default StepTypeSelector;
