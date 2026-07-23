import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { updateProfileService, updatePasswordService, getImageUrl } from '../services/apiService';

export const useSettings = () => {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        phone: '',
        bio: ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const fetchUserData = useCallback(() => {
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(savedUser);
        setFormData({
            name: savedUser.name || '',
            surname: savedUser.surname || '',
            username: savedUser.username || '',
            phone: savedUser.phone || '',
            bio: savedUser.bio || ''
        });
        if (savedUser.profilePicture) {
            setPreviewUrl(getImageUrl(savedUser.profilePicture));
        } else {
            setPreviewUrl(`https://ui-avatars.com/api/?name=${savedUser.username || 'U'}&background=random`);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
        window.addEventListener('userUpdated', fetchUserData);
        return () => window.removeEventListener('userUpdated', fetchUserData);
    }, [fetchUserData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToUpdate = { ...formData };
            if (profilePicture) {
                dataToUpdate.profilePicture = profilePicture;
            }
            const response = await updateProfileService(dataToUpdate);
            if (response.success) {
                toast.success('Perfil actualizado con éxito');
                const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
                // Aseguramos que tomamos solo el objeto 'user' de la respuesta
                const updatedUser = response.user; 
                
                if (updatedUser) {
                    const mergedData = { ...currentUserData, ...updatedUser };
                    localStorage.setItem('user', JSON.stringify(mergedData));
                    setUser(mergedData);
                    // Disparar evento para que useProfile se entere
                    window.dispatchEvent(new Event('userUpdated'));
                }
                setProfilePicture(null);
            } else {
                toast.error(response.message || 'Error al actualizar perfil');
            }
        } catch (error) {
            toast.error('Error de conexión');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword.length < 8) {
            return toast.error('La nueva contraseña debe tener al menos 8 caracteres');
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Las contraseñas no coinciden');
        }
        setLoading(true);
        try {
            const response = await updatePasswordService({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                toast.success('Contraseña actualizada');
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(response.message || 'Error al actualizar contraseña');
            }
        } catch {
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return {
        user, formData, passwordData, previewUrl, loading, activeTab, setActiveTab,
        handleInputChange, handlePasswordChange, handleFileChange,
        handleUpdateProfile, handleUpdatePassword
    };
};
