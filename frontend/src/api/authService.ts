import apiClient from './apiClient';

interface LoginData {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    password: string;
    email: string;
}

export const login = async (data: LoginData) => {
    const response = await apiClient.post('token/', data);
    return response.data;
};

export const refreshToken = async (refreshToken: string) => {
    const response = await apiClient.post('token/refresh/', { refresh: refreshToken });
    return response.data;
};

export const register = async (data: RegisterData) => {
    const response = await apiClient.post('register/', data);
    return response.data;
};
