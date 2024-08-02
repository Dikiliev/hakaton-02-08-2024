import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        fontFamily: 'Manrope, Roboto, Arial, sans-serif',
        h1: {
            fontFamily: 'ActayWide, Arial, sans-serif',
        },
        h2: {
            fontFamily: 'ActayWide, Arial, sans-serif',
        },
        h3: {
            fontFamily: 'ActayWide, Arial, sans-serif',
        },
        h4: {
            fontFamily: 'ActayWide, Arial, sans-serif',
        },
        h5: {
            fontFamily: 'ActayWide, Arial, sans-serif',
        },
        h6: {
            fontFamily: 'ActayWide, Arial, sans-serif',
        },
    },
    palette: {
        primary: {
            main: '#766BED',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#FFA726',
            contrastText: '#ffffff',
        },
        error: {
            main: '#f44336',
        },
        warning: {
            main: '#ff9800',
        },
        info: {
            main: '#2196f3',
        },
        success: {
            main: '#4caf50',
        },
        background: {
            default: '#ffffff',
            paper: '#eee',
        },
        text: {
            primary: '#1A1A1C',
            secondary: '#2C2C2F',
            disabled: '#9e9e9e',
            hint: '#bdbdbd',
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
      </ThemeProvider>
  </React.StrictMode>,
)
