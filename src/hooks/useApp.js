import { useState, useEffect, useCallback } from 'react';
import { logoutUser } from '../services/apiService';

export const useApp = () => {
  const [user, setUser] = useState(null);

  const loadSavedUser = useCallback(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    loadSavedUser();
    window.addEventListener('userUpdated', loadSavedUser);
    return () => window.removeEventListener('userUpdated', loadSavedUser);
  }, [loadSavedUser]);

  const handleLoginSuccess = useCallback((userData) => {
    const userToSave = userData.userDetails || userData;
    const token = userToSave.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    const { token: _t, ...userWithoutToken } = userToSave;
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    setUser(userWithoutToken);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Siempre limpiar sesión local aunque falle la red
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return {
    user,
    handleLoginSuccess,
    handleLogout,
  };
};
