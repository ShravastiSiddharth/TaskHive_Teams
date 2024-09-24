import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const navigate = useNavigate()

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('https://taskhive-teams.onrender.com/api/auth/me')
            
                .then(response =>{
                setUser(response.data.user)})
                .catch(() => {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    navigate('/');
                });
        }
    }, [navigate]);
    
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const authAxios = axios.create();
    authAxios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        console.log("isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, authAxios, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
