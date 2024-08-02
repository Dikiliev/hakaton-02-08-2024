// src/store/auth.ts

import { create } from 'zustand';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

// Интерфейс пользователя
interface User {
    user_id: string | null;
    username: string | null;
    email: string | null;
}

// Интерфейс состояния аутентификации
interface AuthState {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
    register: (accessToken: string) => void;
    setLoading: (loading: boolean) => void;
}

// Создание zustand-хранилища
const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    login: (accessToken: string) => {
        const user = jwtDecode<User>(accessToken);
        set({ user, isAuthenticated: true });
        Cookies.set('access_token', accessToken, { expires: 1 });
    },
    logout: () => {
        Cookies.remove('access_token');
        set({ user: null, isAuthenticated: false });
    },
    register: (accessToken: string) => {
        const user = jwtDecode<User>(accessToken);
        set({ user, isAuthenticated: true });
        Cookies.set('access_token', accessToken, { expires: 1 });
    },
    setLoading: (loading) => set({ loading }),
}));

export { useAuthStore };
