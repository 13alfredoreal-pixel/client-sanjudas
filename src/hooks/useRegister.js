import { useState } from 'react';
import toast from 'react-hot-toast';
import { registerUser, getProfileService } from '../services/apiService';

/**
 * Custom hook for handling user registration.
 * @returns {Object} Register state and functions.
 */
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Attempts to register a new user.
   * @param {Object} userData - The user registration data.
   * @returns {Promise<Object>} The result of the registration attempt.
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Client-side validation: Password match
      if (userData.password !== userData.confirmPassword) {
        const errorMessage = 'Las contraseñas no coinciden';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      const result = await registerUser(userData);

      if (result.error) {
        const msg = result.message || 'Error al registrar usuario';
        setError(msg);
        toast.error(msg);
        return { success: false, error: msg };
      }

      // Store auth data if provided immediately
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      // Obtener datos del perfil después de registrarse para tener la información necesaria en la web
      const profileResult = await getProfileService();

      if (!profileResult.error) {
        const userDetails = { ...profileResult.user, token: result.token };
        localStorage.setItem('user', JSON.stringify(userDetails));
      }

      toast.success('¡Registro exitoso! Bienvenido a la comunidad de libros SJT!');
      return { success: true, data: result };

    } catch (err) {
      const errorMessage = 'Error inesperado al registrar el usuario';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    register,
    loading,
    error,
    clearError
  };
};