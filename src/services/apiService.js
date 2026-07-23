import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://base-rho-lyart.vercel.app/api', // Usa el proxy de Vite para desarrollo local
  timeout: 120000, // 120s para subidas de PDF grandes
  withCredentials: true, // Necesario para enviar cookies seguras HttpOnly
});

export const UPLOADS_URL = `https://base-rho-lyart.vercel.app/api/uploads/`;

/**
 * getImageUrl: Retorna la URL completa de una imagen subida al servidor.
 * @param {string} imageName - El nombre del archivo almacenado.
 * @returns {string} URL completa o null si no hay imagen.
 */
export const getImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http')) return imageName;
  return `${UPLOADS_URL}${imageName}`;
};

/**
 * getPdfUrl: Retorna la URL completa de un PDF subido al servidor.
 * @param {string} pdfUrl - La URL del PDF (puede venir con localhost).
 * @returns {string} URL completa con el backend correcto.
 */
export const getPdfUrl = (pdfUrl) => {
  if (!pdfUrl) return null;
  if (pdfUrl.startsWith('http')) {
    return pdfUrl
      .replace('http://localhost:5173', 'https://base-rho-lyart.vercel.app')
      .replace('http://localhost:3000', 'https://base-rho-lyart.vercel.app')
      .replace('http://127.0.0.1:5173', 'https://base-rho-lyart.vercel.app');
  }
  return pdfUrl;
};

/**
 * getPdfProxyUrl: Retorna la URL del endpoint proxy para obtener un PDF
 * @param {string} bookId - El ID del libro
 * @returns {string} URL del endpoint proxy
 */
export const getPdfProxyUrl = (bookId) => {
  if (!bookId) return null;
  return `${apiClient.defaults.baseURL}/books/${bookId}/pdf`;
};
/**
 * getSignedPdfUrl: Obtiene una URL firmada temporal del servidor
 * @param {string} bookId - El ID del libro
 * @returns {Promise<string>} URL firmada del PDF
 */
export const getSignedPdfUrl = async (bookId) => {
  try {
    const response = await apiClient.get(`/books/${bookId}/signed-url`);
    return response.data.signedUrl;
  } catch (error) {
    console.error('Error getting signed PDF URL:', error);
    return null;
  }
};

// Interceptor: agrega token JWT a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: maneja token expirado y Refresh Token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es una ruta de autenticación
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post('/auth/refresh-token', {}, { withCredentials: true });

        // Guardamos el nuevo AccessToken
        localStorage.setItem('token', data.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

        processQueue(null, data.token);

        // Reintentar la petición original
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Si el refresh falla (ej: expiró a los 7 días o manipulación), limpiar y forzar login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTENTICACIÓN ====================

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (e) {
    return { error: true, message: e.response?.data?.message || 'Error al iniciar sesión' };
  }
};

/**
 * getProfileService: Obtiene los datos del perfil del usuario logueado.
 */
export const getProfileService = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch {
    return { error: true, message: 'Error al obtener el perfil de usuario' };
  }
};

export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (key === 'profilePicture' && userData[key]) {
        formData.append('profilePicture', userData[key]);
      } else if (userData[key]) {
        formData.append(key, userData[key]);
      }
    });
    const response = await apiClient.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (e) {
    return { error: true, message: e.response?.data?.message || 'Error al registrar usuario' };
  }
};

// ==================== LIBROS ====================

/**
 * Obtiene todos los libros. Soporta filtros por categoría y búsqueda y paginación.
 */
export const getBooks = async (category = '', search = '', page = 1, limit = 20) => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'Todos') params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const response = await apiClient.get(`/books?${params.toString()}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al obtener libros', books: [] };
  }
};

/**
 * Obtiene un libro específico por su ID (para el visor de PDF).
 */
export const getBookById = async (id) => {
  try {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al obtener libro' };
  }
};

/**
 * Sube un nuevo libro PDF (solo ADMIN_ROLE).
 * @param {FormData} formData - Debe contener: title, author, category, description, pdf, cover (opcional)
 */
export const uploadBook = async (formData) => {
  try {
    const response = await apiClient.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al subir el libro' };
  }
};

/**
 * Elimina un libro por ID (solo ADMIN_ROLE).
 */
export const deleteBook = async (id) => {
  try {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al eliminar libro' };
  }
};

// ==================== USUARIOS ====================

export const getUsersService = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch {
    return { error: true, message: 'Error al obtener usuarios' };
  }
};

export const updateProfileService = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    const response = await apiClient.put('/users/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al actualizar perfil' };
  }
};

/**
 * updatePasswordService: permite cambiar la contraseña del usuario.
 */
export const updatePasswordService = async (passwords) => {
  try {
    const response = await apiClient.patch('/users/update-password', passwords);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al actualizar contraseña' };
  }
};

/**
 * promoteUserService: llama al backend para elevar un usuario a Administrador.
 */
export const promoteUserService = async (uid) => {
  try {
    const response = await apiClient.patch(`/users/promote/${uid}`);
    return response.data;
  } catch (error) {
    // Si hay error (ej: el usuario no tiene permisos), retornamos el mensaje del servidor
    return { error: true, message: error.response?.data?.message || 'Error al promover usuario' };
  }
};
/**
 * deleteUserService: elimina un usuario por ID.
 */
export const deleteUserService = async (uid) => {
  try {
    const response = await apiClient.delete(`/users/delete/${uid}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al eliminar usuario' };
  }
};
/**
 * getFavoritesService: obtiene la lista de libros favoritos del usuario.
 */
export const getFavoritesService = async () => {
  try {
    const response = await apiClient.get('/users/favorites');
    return response.data;
  } catch {
    return { error: true, message: 'Error al obtener favoritos' };
  }
}

/**
 * toggleFavoriteService: agrega o quita un libro de favoritos.
 */
export const toggleFavoriteService = async (bookId) => {
  try {
    const response = await apiClient.post(`/users/toggle-favorite/${bookId}`);
    return response.data;
  } catch {
    return { error: true, message: 'Error al procesar favorito' };
  }
}

// ==================== CATEGORÍAS ====================

export const getCategoriesService = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch {
    return { error: true, message: 'Error al obtener categorías', categories: [] };
  }
};

export const createCategoryService = async (categoryData) => {
  try {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || 'Error al crear la categoría',
      serverError: error.response?.data?.error || null,
      serverStack: error.response?.data?.stack || null
    };
  }
};

export const deleteCategoryService = async (id) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al eliminar la categoría' };
  }
};

// ==================== REVIEWS ====================

export const getReviewsService = async (bookId) => {
  try {
    const response = await apiClient.get(`/reviews/book/${bookId}`);
    return response.data;
  } catch {
    return { error: true, message: 'Error al obtener reseñas', reviews: [] };
  }
};

export const addReviewService = async (reviewData) => {
  try {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al publicar reseña' };
  }
};

export const deleteReviewService = async (id) => {
  try {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Error al eliminar reseña' };
  }
};

// ==================== ANALYTICS ====================

export const getAnalyticsService = async () => {
  try {
    const response = await apiClient.get('/analytics');
    return response.data;
  } catch {
    return { error: true, message: 'Error al obtener analíticas' };
  }
};

// ==================== READING PROGRESS ====================

export const updateReadingProgressService = async (bookId, page) => {
  try {
    const response = await apiClient.patch('/users/reading-progress', { bookId, page });
    return response.data;
  } catch {
    return { error: true, message: 'Error al actualizar progreso' };
  }
};
