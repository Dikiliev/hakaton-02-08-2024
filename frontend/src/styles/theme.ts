import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#C4F230',
            contrastText: '#111111',
        },
        secondary: {
            main: '#ff4081', //
            contrastText: '#ffffff',
        },
        background: {
            default: '#111111',
            paper: '#000000',
        },
        text: {
            primary: '#fff',
            secondary: '#c2c2c2',
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
