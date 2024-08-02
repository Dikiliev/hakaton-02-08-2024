import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import theme from '@styles/theme.ts';
import Header from '@components/header/Header.tsx';
import HomePage from '@pages/homePage/HomePage.tsx';
import LoginForm from '@components/auth/LoginForm.tsx';
import RegisterForm from '@components/auth/RegisterForm.tsx';
import '@styles/global.css';
import globalStyles from '@styles/globalStyles.ts';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={globalStyles(theme)} />

                <Router>
                    <Header></Header>
                    <Routes>
                        <Route path="/" element={<HomePage />} />

                    </Routes>
                </Router>


        </ThemeProvider>
    );
};


export default App;
