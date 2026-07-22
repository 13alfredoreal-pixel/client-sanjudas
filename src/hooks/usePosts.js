import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPosts } from "../services/apiService";

/**
 * Custom hook to fetch a paginated list of posts.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of posts per page.
 * @returns {Object} Posts data, loading state, error, and refresh function.
 */
export const usePosts = (page = 1, limit = 10, genre = '', search = '', sort = '') => {
  // --- ESTADO DEL HOOK ---
  const [posts, setPosts] = useState([]); // Almacena la lista de publicaciones
  const [loading, setLoading] = useState(true); // Indica si la carga de publicaciones está en curso
  const [error, setError] = useState(null); // Almacena mensajes de error si ocurren durante la carga de publicaciones
  const [pagination, setPagination] = useState({ page: 1, pages: 1, totalPosts: 0 }); // Datos de paginación de la DB

  // --- FUNCIÓN PARA OBTENER DATOS (Fetch) ---
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Llama al servicio API pasándole filtros
      const data = await getPosts(page, limit, genre, search, sort);
      console.log("Data received in usePosts:", data);

      if (data.error) {
        const msg = data.message || "Error al obtener las publicaciones";
        setError(msg);
        toast.error(msg);
      } else if (data.posts) {
        setPosts(data.posts);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      const msg = "Error inesperado al cargar el feed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- EFECTO SECUNDARIO ---
  // Se vuelve a ejecutar automáticamente cada vez que los filtros cambian
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [page, limit, genre, search, sort]);

  return { posts, loading, error, pagination, refresh: fetchPosts };
};
