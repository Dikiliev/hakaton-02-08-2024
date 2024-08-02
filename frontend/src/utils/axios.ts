// src/utils/axios.ts

import axios from 'axios';
import {API_BASE_URL} from "@utils/constants.ts";

const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // Таймаут после 5 секунд
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default apiInstance;
