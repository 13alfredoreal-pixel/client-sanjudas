import { useState } from 'react';
import toast from 'react-hot-toast';
import { createPostService } from '../services/apiService';

/**
 * Custom hook for creating new posts.
 * @returns {Object} Post creation state and function.
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Creates a new post with the given data.
   * @param {Object} postData - The post data (title, content, image).
   * @returns {Promise<Object>} The result of the operation.
   */
  const createPost = async (postData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await createPostService(postData);

      if (result.error) {
        const msg = result.message || 'Error al crear la publicación';
        setError(msg);
        toast.error(msg);
        return { success: false, error: msg };
      }

      setSuccess(true);
      toast.success('Publicación creada exitosamente');
      return { success: true, data: result };
    } catch {
      const msg = 'Error inesperado al crear la publicación';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error, success };
};
