// src/components/HomePage.jsx

import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <Container maxWidth="lg" className={styles.container}>
            {/* Приветственная секция */}
            <Box className={styles.hero} sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h3" className={styles.title} gutterBottom>
                    Добро пожаловать в мое портфолио!
                </Typography>
                <Typography variant="h6" className={styles.subtitle} paragraph>
                    Изучите мои работы, проекты и опыт.
                </Typography>
                <Button variant="contained" color="primary" size="large">
                    Узнать больше
                </Button>
            </Box>

            {/* Секция с изображением и текстом */}
            <Grid container spacing={4} sx={{ py: 5, alignItems: 'center' }}>
                <Grid item xs={12} md={6}>
                    <img
                        src="/i.png"
                        alt="Портфолио"
                        className={styles.image}
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        Обо мне
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Я — опытный разработчик с сильными навыками в создании современных веб-приложений.
                        Работаю с такими технологиями, как React, TypeScript, и Material-UI, чтобы создавать
                        красивые и эффективные интерфейсы.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        В моем портфолио представлены проекты, над которыми я работал, а также моя экспертиза
                        в различных областях разработки. Буду рад обсудить возможности сотрудничества!
                    </Typography>
                </Grid>
            </Grid>

            {/* Секция с особенностями */}
            <Box sx={{ py: 5 }}>
                <Typography variant="h4" className={styles.title} gutterBottom align="center">
                    Особенности
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper className={styles.feature} elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Современные технологии
                            </Typography>
                            <Typography variant="body2">
                                Использую передовые технологии для создания быстрых и надежных веб-приложений.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper className={styles.feature} elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Индивидуальный подход
                            </Typography>
                            <Typography variant="body2">
                                Каждый проект — уникален, и я всегда ищу наилучшие решения для ваших нужд.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper className={styles.feature} elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Качественный код
                            </Typography>
                            <Typography variant="body2">
                                Забочусь о чистоте и поддерживаемости кода для долгосрочного успеха вашего проекта.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default HomePage;
