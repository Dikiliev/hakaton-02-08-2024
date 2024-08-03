// components/LessonStepsList.jsx

import { Box, Typography, Grid } from '@mui/material';

const LessonStepsList = ({ steps, activeStepIndex, onStepClick }) => (
    <Box sx={{ mt: 4, mb: 2 }}>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {steps.map((step, index) => (
                <Grid item key={step.id}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: activeStepIndex === index ? 'primary.main' : 'background.paper',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: activeStepIndex === index ? 'primary.dark' : 'text.primary',
                        }}
                        onClick={() => onStepClick(index)}
                    >
                        <Typography variant="button">{index + 1}</Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
);

export default LessonStepsList;
