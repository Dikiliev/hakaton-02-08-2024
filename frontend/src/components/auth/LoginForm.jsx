import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '@utils/auth.js';
import { useState } from 'react';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await login(username, password);
            if (error) {
                setError(error.toString());
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Произошла ошибка при входе.');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToRegister = () => {
        navigate('/register'); // Переход на страницу регистрации
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 300, margin: 'auto', mt: 5 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Вход
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <TextField
                label="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
            <Typography
                variant="body2"
                component="a"
                sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'primary.main', cursor: 'pointer' }}
                onClick={handleNavigateToRegister}
            >
                Нет аккаунта? Зарегистрируйтесь
            </Typography>
        </Box>
    );
};

export default LoginForm;
