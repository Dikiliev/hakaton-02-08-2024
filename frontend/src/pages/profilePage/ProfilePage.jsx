// components/ProfileEdit.jsx

import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Alert, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '@utils/useAxios';

const ProfileEdit = () => {
    const axiosInstance = useAxios();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        avatar: null,
        avatar_url: '', // Для отображения текущей аватарки
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Загрузка текущих данных пользователя
        axiosInstance.get('/profile/')
            .then(response => {
                setUserData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                setError('Ошибка при загрузке профиля.');
                setLoading(false);
            });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setUserData(prevData => ({
            ...prevData,
            avatar: file,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('first_name', userData.first_name);
        formData.append('last_name', userData.last_name);

        // Добавляем аватар только если он изменен
        if (userData.avatar) {
            formData.append('avatar', userData.avatar);
        }

        try {
            const response = await axiosInstance.put('/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUserData(response.data);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                setError(`Ошибка: ${JSON.stringify(err.response.data)}`);
            } else {
                setError('Ошибка при обновлении профиля.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 5, p: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Редактирование профиля
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                    alt={userData.username}
                    src={userData.avatar || ''}
                    sx={{ width: 80, height: 80 }}
                />
            </Box>
            <TextField
                label="Имя пользователя"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Имя"
                name="first_name"
                value={userData.first_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Фамилия"
                name="last_name"
                value={userData.last_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                type="file"
                onChange={handleFileChange}
                fullWidth
                margin="normal"
                inputProps={{ accept: 'image/*' }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Сохранить изменения'}
            </Button>
        </Box>
    );
};

export default ProfileEdit;
