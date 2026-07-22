import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    getBooks, uploadBook, deleteBook, getUsersService, promoteUserService, 
    deleteUserService, getCategoriesService, createCategoryService, 
    deleteCategoryService, getAnalyticsService 
} from '../services/apiService';

export const useAdmin = (user) => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [promoting, setPromoting] = useState(null);
    const [categories, setCategories] = useState([]);
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: '', icon: '📄' });
    const [analytics, setAnalytics] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // Estado del formulario
    const [form, setForm] = useState({ title: '', author: '', category: '', description: '' });
    const [pdfFile, setPdfFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    // Protección de ruta
    useEffect(() => {
        if (user?.role !== 'ADMIN_ROLE') {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        const data = await getBooks();
        if (!data.error) setBooks(data.books || []);
        setLoading(false);
    }, []);

    const fetchUsers = useCallback(async () => {
        const data = await getUsersService();
        if (!data.error) setAllUsers(data.users || []);
    }, []);

    const fetchCategories = useCallback(async () => {
        const data = await getCategoriesService();
        if (!data.error) {
            const fetchedCategories = data.categories || [];
            setCategories(fetchedCategories);
            
            // Si el formulario no tiene categoría, intentar poner la primera disponible o 'Otros'
            if (!form.category) {
                const defaultCat = fetchedCategories.length > 0 ? fetchedCategories[0].name : 'Otros';
                setForm(prev => ({ ...prev, category: defaultCat }));
            }
        }
    }, [form.category]);

    const fetchAnalytics = useCallback(async () => {
        setLoadingStats(true);
        const data = await getAnalyticsService();
        if (!data.error) setAnalytics(data);
        setLoadingStats(false);
    }, []);

    useEffect(() => {
        fetchBooks();
        fetchUsers();
        fetchCategories();
        fetchAnalytics();
    }, [fetchBooks, fetchUsers, fetchCategories, fetchAnalytics]);

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pdfFile) {
            toast.error('Debes seleccionar un archivo PDF');
            return;
        }
        if (!form.title.trim() || !form.author.trim()) {
            toast.error('El título y el autor son obligatorios');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('author', form.author);
        formData.append('category', form.category);
        formData.append('description', form.description);
        formData.append('pdf', pdfFile);
        if (coverFile) formData.append('cover', coverFile);

        const result = await uploadBook(formData);
        setUploading(true); // Se mantiene en true mientras recargamos, o se pone a false al final

        if (result.error) {
            toast.error(result.message);
            setUploading(false);
        } else {
            toast.success('📚 Libro subido correctamente');
            const defaultCat = categories.length > 0 ? categories[0].name : 'Otros';
            setForm({ title: '', author: '', category: defaultCat, description: '' });
            setPdfFile(null);
            setCoverFile(null);
            // Reset file inputs (Esto debe manejarse en la UI, pasaremos el reset handler o los refs)
            if (document.getElementById('pdf-input')) document.getElementById('pdf-input').value = '';
            if (document.getElementById('cover-input')) document.getElementById('cover-input').value = '';
            await fetchBooks();
            setUploading(false);
        }
    };

    const handleDelete = async (book) => {
        if (!window.confirm(`¿Eliminar "${book.title}"? Esta acción no se puede deshacer.`)) return;
        setDeleting(book._id);
        const result = await deleteBook(book._id);
        if (result.error) {
            toast.error(result.message);
        } else {
            toast.success('Libro eliminado');
            fetchBooks();
        }
        setDeleting(null);
    };

    const handlePromote = async (uid) => {
        if (!window.confirm('¿Estás seguro de que quieres otorgar el rol de administrador a este usuario?')) return;
        setPromoting(uid);
        const result = await promoteUserService(uid);
        if (result.error) {
            toast.error(result.message);
        } else {
            toast.success('¡Usuario promovido a Administrador correctamente!');
            fetchUsers();
        }
        setPromoting(null);
    };

    const handleDeleteUser = async (uid, username) => {
        if (!window.confirm(`¿Estás seguro de que quieres ELIMINAR al usuario "${username}"? Esta acción no se puede deshacer.`)) return;

        const result = await deleteUserService(uid);
        if (result.error) {
            toast.error(result.message);
        } else {
            toast.success(`Usuario ${username} eliminado.`);
            fetchUsers();
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) return;
        setCreatingCategory(true);
        const result = await createCategoryService(categoryForm);
        setCreatingCategory(false);
        if (result.error) {
            console.error('[DEBUG] FULL Error object:', result);
            toast.error(typeof result.message === 'string' ? result.message : 'Error desconocido al crear categoría');
        } else {
            toast.success('Categoría creada');
            setCategoryForm({ name: '', icon: '📄' });
            fetchCategories();
        }
    };

    const handleDeleteCategory = async (catId, catName) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${catName}"?`)) return;
        const result = await deleteCategoryService(catId);
        if (result.error) {
            toast.error(result.message);
        } else {
            toast.success('Categoría eliminada');
            fetchCategories();
        }
    };

    return {
        books, loading, uploading, deleting, allUsers, promoting,
        categories, creatingCategory, categoryForm, setCategoryForm,
        analytics, loadingStats, form, setForm, pdfFile, setPdfFile,
        coverFile, setCoverFile, handleFormChange, handleSubmit,
        handleDelete, handlePromote, handleDeleteUser,
        handleCreateCategory, handleDeleteCategory
    };
};
