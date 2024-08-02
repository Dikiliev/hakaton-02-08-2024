import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, refreshToken as apiRefreshToken } from '../api/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем наличие токена при загрузке приложения
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const { access, refresh } = await apiLogin({ username, password });
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};
