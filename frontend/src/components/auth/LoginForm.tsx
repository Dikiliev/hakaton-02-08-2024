import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';
import { login } from '@api/authService';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const { access, refresh } = await login({ username, password });
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 300, mx: 'auto', mt: 5 }}>
            <TextField
                label="Имя пользователя"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Пароль"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Войти
            </Button>
        </Box>
    );
};

export default LoginForm;
