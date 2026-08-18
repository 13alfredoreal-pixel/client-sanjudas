import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBookById,
  getReviewsService,
  addReviewService,
  deleteReviewService,
  getSignedPdfUrl,
  getProfileService,
  resolveReadablePdfUrl,
} from '../services/apiService';
import { pdfjs } from 'react-pdf';

// Configuración robusta del worker de PDF.js usando UNPKG
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const useBookViewer = (id, user) => {
  const isAdmin = user?.role === 'ADMIN_ROLE';
  const navigate = useNavigate();

  // Estados principales
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados del visor PDF
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [theme, setTheme] = useState('default'); // 'default', 'sepia', 'night'
  const [scale, setScale] = useState(0.85);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Estados de Reseñas
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Detección de dispositivo
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBook = useCallback(async () => {
    setLoading(true);
    setError('');
    const data = await getBookById(id);
    if (data.error) {
      setError(data.message);
      setLoading(false);
      return;
    }

    setBook(data.book);

    const signed = await getSignedPdfUrl(id);
    const readable = resolveReadablePdfUrl(data.book, signed);
    if (!readable) {
      setError(signed.message || 'No se pudo cargar el PDF');
      setPdfUrl(null);
    } else {
      setPdfUrl(readable);
    }

    // Restaurar progreso de lectura desde el perfil
    if (user && user.role !== 'ADMIN_ROLE') {
      try {
        const profile = await getProfileService();
        const progressList = profile?.user?.readingProgress || profile?.readingProgress || [];
        const entry = progressList.find((p) => {
          const bookRef = p.book?._id || p.book;
          return bookRef && String(bookRef) === String(id);
        });
        if (entry?.lastPage && entry.lastPage > 1) {
          setPageNumber(entry.lastPage);
        }
      } catch (err) {
        console.error('Error restoring reading progress', err);
      }
    }

    const revData = await getReviewsService(id);
    if (!revData.error) {
      setReviews(revData.reviews || []);
      if (user) {
        const uid = user.uid || user.id || user._id;
        const existing = (revData.reviews || []).find(
          (r) => (r.user?._id === uid || r.user === uid) && uid,
        );
        if (existing) setHasReviewed(true);
      }
    }

    setLoading(false);
  }, [id, user]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    const res = await addReviewService({ bookId: id, rating: userRating, comment: userComment });
    if (!res.error) {
      const revData = await getReviewsService(id);
      if (!revData.error) setReviews(revData.reviews || []);
      setHasReviewed(true);
      setUserComment('');
    } else {
      alert(res.message);
    }
    setSubmittingReview(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta reseña?')) return;
    const res = await deleteReviewService(reviewId);
    if (!res.error) {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setHasReviewed(false);
    }
  };

  // PROTECCIÓN ANTI-PLAGIO
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAdmin) return;
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();

      if (
        isCtrl &&
        (key === 's' || key === 'p' || key === 'u' || key === 'i' || key === 't' || key === 'n')
      ) {
        e.preventDefault();
        console.warn('[Seguridad] Acción restringida.');
      }
      if (isCtrl && isShift && (key === 't' || key === 'i' || key === 'p')) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e) => {
      if (!isAdmin) e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isAdmin]);

  // GUARDADO AUTOMÁTICO DE PROGRESO
  useEffect(() => {
    if (!user || user.role === 'ADMIN_ROLE') return;

    const saveProgress = async () => {
      try {
        const api = await import('../services/apiService');
        await api.updateReadingProgressService(id, pageNumber);
      } catch (err) {
        console.error('Error saving progress', err);
      }
    };

    const timeout = setTimeout(saveProgress, 2000);
    return () => clearTimeout(timeout);
  }, [pageNumber, id, user]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber((prev) => {
      const jump = isMobile ? offset : offset * 2;
      const next = prev + jump;
      return Math.min(Math.max(1, next), numPages);
    });
  };

  const getFilter = () => {
    if (theme === 'sepia') return 'sepia(0.5) contrast(1.1) brightness(0.95)';
    if (theme === 'night') return 'invert(0.9) hue-rotate(180deg) brightness(0.75) contrast(1.2)';
    return 'none';
  };

  const getBackground = () => {
    if (theme === 'sepia') return '#fdf6e3';
    if (theme === 'night') return '#0f172a';
    return 'rgba(15, 23, 42, 0.95)';
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return {
    book,
    loading,
    error,
    numPages,
    pageNumber,
    theme,
    setTheme,
    scale,
    setScale,
    isMobile,
    showReviews,
    setShowReviews,
    reviews,
    userRating,
    setUserRating,
    userComment,
    setUserComment,
    submittingReview,
    hasReviewed,
    handleSubmitReview,
    handleDeleteReview,
    onDocumentLoadSuccess,
    changePage,
    getFilter,
    getBackground,
    isAdmin,
    navigate,
    averageRating,
    pdfUrl,
  };
};
