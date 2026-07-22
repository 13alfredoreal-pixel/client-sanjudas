import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageUrl, deleteUserService } from '../services/apiService';

export const useProfile = (propUser) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const fetchUserData = useCallback(() => {
        if (propUser && propUser.uid) {
            setUser(propUser);
        } else {
            const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(savedUser);
        }
    }, [propUser]);

    useEffect(() => {
        fetchUserData();
        // Escuchar actualizaciones globales del usuario
        window.addEventListener('userUpdated', fetchUserData);
        return () => window.removeEventListener('userUpdated', fetchUserData);
    }, [fetchUserData]);

    const profileImage = useMemo(() => {
        return user.profilePicture
            ? getImageUrl(user.profilePicture)
            : `https://ui-avatars.com/api/?name=${user.username || 'U'}&background=random`;
    }, [user.profilePicture, user.username]);

    const handleDeleteAccount = async () => {
        if (!window.confirm('¿ESTÁS SEGURO? Esta acción eliminará permanentemente tu cuenta y no se puede deshacer.')) return;

        const loadingToast = toast.loading('Eliminando cuenta...');
        const result = await deleteUserService(user.uid || user._id);
        toast.dismiss(loadingToast);

        if (result.error) {
            toast.error(result.message);
        } else {
            toast.success('Cuenta eliminada. Lamentamos verte partir.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    return {
        user,
        profileImage,
        navigate,
        handleDeleteAccount
    };
};
