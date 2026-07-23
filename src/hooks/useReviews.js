import { useState, useEffect, useCallback } from 'react';
import { getReviews, addReview, deleteReview } from '../services/apiService';
import toast from 'react-hot-toast';

export const useReviews = (bookId, user) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const data = await getReviews(bookId);
    if (data.success) {
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    }
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAddReview = async (e) => {
    if (e) e.preventDefault();
    if (!newReview.comment.trim()) {
      return toast.error('Escribe un comentario');
    }

    setIsSubmitting(true);
    const res = await addReview({
      bookId,
      rating: newReview.rating,
      comment: newReview.comment,
    });

    if (res.success) {
      toast.success('¡Gracias por tu reseña!');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } else {
      toast.error(res.message || 'Error al enviar reseña');
    }
    setIsSubmitting(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Eliminar esta reseña?')) return;

    const res = await deleteReview(reviewId);
    if (res.success) {
      toast.success('Reseña eliminada');
      fetchReviews();
    } else {
      toast.error('No se pudo eliminar');
    }
  };

  const userHasReviewed = reviews.some(
    (r) => r.user?.uid === user?.uid || r.user?._id === user?.uid,
  );

  return {
    reviews,
    averageRating,
    totalReviews,
    loading,
    newReview,
    setNewReview,
    isSubmitting,
    handleAddReview,
    handleDeleteReview,
    userHasReviewed,
  };
};
