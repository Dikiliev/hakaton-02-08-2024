import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8576FF',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff4081', //
            contrastText: '#ffffff',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#777777',
        },
    },
    typography: {
        fontFamily: 'Monrope, sans-serif',
        h1: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h2: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h3: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h4: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h5: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h6: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        button: {
            fontFamily: 'Manrope',
        },
    },
});

export default theme;
