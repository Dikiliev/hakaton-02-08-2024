// components/LessonStepsList.jsx

import React from 'react';
import { Box, Typography } from '@mui/material';

const LessonStepsList = ({ steps }) => (
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
);

export default LessonStepsList;
