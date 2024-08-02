// src/utils/axios.ts

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api/';

const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // Таймаут после 5 секунд
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Интерсептор для добавления токена авторизации к каждому запросу
apiInstance.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiInstance;
