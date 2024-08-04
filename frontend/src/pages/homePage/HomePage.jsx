// HomePage.jsx
import React from 'react';
import {Box, Typography, Button, Container, Paper, Grid, Divider} from '@mui/material';

const HomePage = () => {
    return (
        <Container sx={{ my: 4 }}>
            <Paper elevation={4} sx={{ px: 5, pb: 5, pt: {xs: 5} }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Обучение на будущее:
                            <Typography color={'primary'} variant="h5" component="h1">Беспилотные авиационные системы</Typography>
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Платформа адаптируется под ваш уровень и помогает интегрировать новые технологии в вашу учебу.
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                            Выбрать курс
                        </Button>
                        {/*<Button variant="outlined" color="primary">
                            Подробнее о курсах
                        </Button>*/}
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box component="img" src="/drone.png" alt="Student with drone" sx={{ width: 420, height: 420, borderRadius: '10px' }} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid item xs={4}>
                        <Typography color={'primary'} variant="h6" component="p">200+</Typography>
                        <Typography variant="body2">курсов по БАС</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography color={'primary'} variant="h6" component="p">90% </Typography>
                        <Typography variant="body2">участников прошли сертификацию</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography color={'primary'} variant="h6" component="p">1500+</Typography>
                        <Typography variant="body2">студентов</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default HomePage;
