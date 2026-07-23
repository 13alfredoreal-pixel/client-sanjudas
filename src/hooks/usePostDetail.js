import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getPostById } from '../services/apiService';

/**
 * Custom hook to fetch a single post by ID.
 * @param {string} id - The ID of the post to fetch.
 * @returns {Object} Post data, loading state, error, and refresh function.
 */
export const usePostDetail = (id) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const data = await getPostById(id);

      if (data.error) {
        setError(data.message);
        toast.error(data.message || 'Error al cargar el post');
      } else {
        setPost(data.post);
      }
    } catch {
      const msg = 'Error al cargar el post';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [id]);

  return { post, loading, error, fetchPost };
};
