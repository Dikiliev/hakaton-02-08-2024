// src/services/auth.ts

import { useAuthStore } from '../store/auth';
import axiosInstance from '../utils/axios'; // Импорт axios из корректного пути
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

// Интерфейс для декодированного токена
interface DecodedToken {
    exp: number;
    user_id: string;
    username: string;
}

// Интерфейсы для ответов от API
interface AuthResponse {
    access: string;
    refresh: string;
}

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

// Функция для логина
export const login = async (username: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
        const { data, status } = await axiosInstance.post<AuthResponse>('users/token/', {
            username,
            password,
        });
        if (status === 200) {
            setAuthUser(data.access, data.refresh);
        }
        return { data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.detail || 'Что-то пошло не так',
        };
    }
};

// Функция для регистрации
export const register = async (
    username: string,
    email: string,
    password: string,
    password2: string
): Promise<ApiResponse<unknown>> => {
    try {
        const { data } = await axiosInstance.post('users/register/', {
            username,
            email,
            password,
            password2,
        });
        await login(username, password);
        return { data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data || 'Что-то пошло не так',
        };
    }
};

// Функция для выхода из системы
export const logout = (): void => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    useAuthStore.getState().setUser(null);
};

// Функция для установки пользователя
export const setUser = async (): Promise<void> => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    if (!accessToken || !refreshToken) {
        return;
    }
    if (isAccessTokenExpired(accessToken)) {
        const response = await getRefreshToken(refreshToken);
        setAuthUser(response.access, response.refresh);
    } else {
        setAuthUser(accessToken, refreshToken);
    }
};

// Функция для установки пользователя и токенов аутентификации
export const setAuthUser = (access_token: string, refresh_token: string): void => {
    Cookies.set('access_token', access_token, {
        expires: 1,
        secure: true,
    });

    Cookies.set('refresh_token', refresh_token, {
        expires: 7,
        secure: true,
    });

    const user = jwtDecode<DecodedToken>(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

// Функция для получения нового токена доступа
export const getRefreshToken = async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('users/token/refresh/', {
        refresh: refreshToken,
    });
    return response.data;
};

// Функция для проверки истечения срока действия токена доступа
export const isAccessTokenExpired = (accessToken: string | undefined): boolean => {
    try {
        const decodedToken = jwtDecode<DecodedToken>(accessToken!);
        return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
        return true; // Токен недействителен или истек
    }
};
