import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // In a real app, you'd verify the token with the backend here
      // For now, we'll just assume the token is valid
      setUser({ isAuthenticated: true });
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const { token } = response.data.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser({ isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);