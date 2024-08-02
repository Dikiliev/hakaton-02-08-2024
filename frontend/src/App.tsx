import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@styles/theme.ts';
import Header from "@components/header/Header.tsx";
import HomePage from "@pages/homePage/HomePage.tsx";
import LoginForm from "@components/auth/LoginForm.tsx";
import RegisterForm from "@components/auth/RegisterForm.tsx";

import '@styles/global.css';
import { AuthProvider } from "@context/AuthContext.tsx";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
};

export default App;
