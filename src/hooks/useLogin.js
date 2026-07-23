import { useState } from 'react';
import toast from 'react-hot-toast';
import { loginUser, getProfileService } from '../services/apiService';

/**
 * Custom hook for handling user login.
 * @returns {Object} Login state and functions.
 */
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Attempts to log in a user with the provided credentials.
   * @param {Object} credentials - The user credentials (email/username, password).
   * @returns {Promise<Object>} The result of the login attempt.
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginUser(credentials);

      if (result.error) {
        const msg = result.message || 'Error al iniciar sesión';
        setError(msg);
        toast.error(msg);
        return { success: false, error: msg };
      }

      // Store auth data
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      // Obtener datos del perfil después de tener el token
      const profileResult = await getProfileService();

      if (profileResult.error) {
        const msg = 'Sesión iniciada pero no se pudo cargar el perfil';
        setError(msg);
        toast.error(msg);
        return { success: false, error: msg };
      }

      const userDetails = { ...profileResult.user, token: result.token };
      localStorage.setItem('user', JSON.stringify(userDetails));

      toast.success('¡Bienvenido de vuelta!');
      return { success: true, data: { userDetails } };
    } catch {
      const errorMessage = 'Error inesperado al iniciar sesión';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      // Ensure loading is always false at the end
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    loading,
    error,
    clearError,
  };
};
