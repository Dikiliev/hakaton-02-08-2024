import { Theme } from '@mui/material/styles';

const globalStyles = (theme: Theme) => ({
    ':root': {
        '--primary-main': theme.palette.primary.main,
        '--text-primary': theme.palette.text.primary,
    },
});

export default globalStyles;
