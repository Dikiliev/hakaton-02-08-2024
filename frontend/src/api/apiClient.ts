import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/', // Убедитесь, что это ваш бэкэнд URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
