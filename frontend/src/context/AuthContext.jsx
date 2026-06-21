import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('trackline_token');
      const storedUser = localStorage.getItem('trackline_user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const { data } = await api.get('/auth/me');
          setUser(data.user);
          localStorage.setItem('trackline_user', JSON.stringify(data.user));
        } catch (err) {
          localStorage.removeItem('trackline_token');
          localStorage.removeItem('trackline_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('trackline_token', data.token);
    localStorage.setItem('trackline_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('trackline_token', data.token);
    localStorage.setItem('trackline_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('trackline_token');
    localStorage.removeItem('trackline_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
