import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@styles/theme.ts';
import Header from "@components/header/Header.tsx";
import HomePage from "@pages/homePage/HomePage.tsx";

import '@styles/global.css'




const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <HomePage />
        </ThemeProvider>
    );
};

export default App;
