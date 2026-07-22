import { useState, useEffect, useCallback } from 'react';

export const useApp = () => {
    const [user, setUser] = useState(null);

    // Carga la sesión guardada y escucha actualizaciones
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
        // Escuchar cambios globales en los datos del usuario
        window.addEventListener('userUpdated', loadSavedUser);
        return () => window.removeEventListener('userUpdated', loadSavedUser);
    }, [loadSavedUser]);


    const handleLoginSuccess = useCallback((userData) => {
        const userToSave = userData.userDetails || userData;
        const token = userToSave.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        // Guardar sin el token en 'user' para mayor claridad y seguridad en el cliente
        const { token: _t, ...userWithoutToken } = userToSave;
        localStorage.setItem('user', JSON.stringify(userWithoutToken));
        setUser(userWithoutToken);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // Opcional: Redirigir usando window.location.href si no estamos en un Router context
        // Pero App.jsx ya envuelve a Routes, así que el cambio de estado 'user' a null
        // provocará que se renderice AuthPage automáticamente.
    }, []);

    return {
        user,
        handleLoginSuccess,
        handleLogout
    };
};
