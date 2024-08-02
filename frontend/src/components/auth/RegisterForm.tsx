import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { register } from '@api/authService';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await register({ username, password, email });
            navigate('/login');
        } catch (error) {
            console.error('Ошибка регистрации:', error);
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
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Зарегистрироваться
            </Button>
        </Box>
    );
};

export default RegisterForm;
