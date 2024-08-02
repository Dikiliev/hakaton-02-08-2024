import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useAuth } from '@context/AuthContext';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await login(username, password);
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
