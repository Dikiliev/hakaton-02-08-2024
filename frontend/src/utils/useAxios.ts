// src/utils/axios.ts

import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth';
import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

const useAxios = (): AxiosInstance => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    axiosInstance.interceptors.request.use(async (req: AxiosRequestConfig) => {
        if (!isAccessTokenExpired(accessToken)) return req;

        if (refreshToken) {
            try {
                const response = await getRefreshToken(refreshToken);

                setAuthUser(response.access, response.refresh);

                req.headers = {
                    ...req.headers,
                    Authorization: `Bearer ${response.access}`,
                };
            } catch (error) {
                // Обработка ошибок, например, удаление токенов, если обновление не удалось
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                throw new Error('Failed to refresh token');
            }
        }

        return req;
    });

    return axiosInstance;
};

export default useAxios;
