import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, getFavoritesService, toggleFavoriteService, getCategoriesService } from '../services/apiService';

export const useLibrary = (user) => {
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]); // Versión sin filtrar para stats
    const [favorites, setFavorites] = useState([]);
    const [dbCategories, setDbCategories] = useState([]); // Categorías desde DB
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('Todos');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigate = useNavigate();

    // Efecto para traer categorías solo al montar
    useEffect(() => {
        const fetchCategories = async () => {
            const catData = await getCategoriesService();
            if (!catData.error) {
                setDbCategories(catData.categories || []);
            }
        };
        fetchCategories();
    }, []);

    const fetchAllData = useCallback(async (pageNum = 1, isLoadingMore = false) => {
        if (!isLoadingMore) setLoading(true);
        else setLoadingMore(true);

        // Traer todos los libros solo para stats si no estamos paginando
        if (!isLoadingMore) {
            const dataAll = await getBooks('', '', 1, 0); 
            if (!dataAll.error) {
                setAllBooks(dataAll.books || []);
            }
        }

        // Traer favoritos si hay usuario
        let favIds = [];
        if (user) {
            const favData = await getFavoritesService();
            if (!favData.error) {
                favIds = favData.favorites.map(f => f._id || f);
                setFavorites(favIds);
            }
        }

        // Lógica de filtrado y obtención de libros
        if (category === 'Mis Favoritos') {
            const dataAll = await getBooks('', '', 1, 0);
            const totalBooks = dataAll.books || [];
            const filtered = totalBooks.filter(b => favIds.includes(b._id));
            setBooks(filtered);
            setTotalPages(1);
        } else {
            const data = await getBooks(category, search, pageNum, 18);
            if (!data.error) {
                if (isLoadingMore) {
                    setBooks(prev => [...prev, ...data.books]);
                } else {
                    setBooks(data.books || []);
                }
                if (data.pagination) setTotalPages(data.pagination.totalPages);
            }
        }

        setLoading(false);
        setLoadingMore(false);
    }, [category, search, user]);

    useEffect(() => {
        setPage(1); 
        fetchAllData(1, false);
    }, [category, search, user, fetchAllData]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAllData(nextPage, true);
    };

    const handleToggleFavorite = async (e, bookId) => {
        e.stopPropagation();
        const res = await toggleFavoriteService(bookId);
        if (!res.error) {
            setFavorites(prev =>
                prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
            );
        }
    };

    const displayCategories = useMemo(() => {
        return ['Todos', ...dbCategories.map(c => c.name), 'Mis Favoritos'];
    }, [dbCategories]);

    const categoryIcons = useMemo(() => {
        const icons = { Todos: '📚', 'Mis Favoritos': '❤️' };
        dbCategories.forEach(c => {
            icons[c.name] = c.icon || '📄';
        });
        return icons;
    }, [dbCategories]);

    const stats = useMemo(() => {
        return {
            total: allBooks.length,
            byCategory: displayCategories.reduce((acc, cat) => {
                acc[cat] = allBooks.filter(b => b.category === cat).length;
                return acc;
            }, {}),
            featured: allBooks.slice(0, 3)
        };
    }, [allBooks, displayCategories]);

    return {
        books, favorites, dbCategories, loading, category, setCategory,
        search, setSearch, searchInput, setSearchInput, page, totalPages, loadingMore,
        handleSearch, handleLoadMore, handleToggleFavorite, displayCategories,
        categoryIcons, stats, navigate
    };
};
