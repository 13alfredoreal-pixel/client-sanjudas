import React from 'react';
import { FaStar, FaRegStar, FaTrash, FaUserCircle } from 'react-icons/fa';
import { useReviews } from '../../hooks/useReviews';
import { getImageUrl } from '../../services/apiService';

export const ReviewsSection = ({ bookId, user }) => {
  const {
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
  } = useReviews(bookId, user);

  if (loading) return <div className="text-slate-400">Cargando reseñas...</div>;

  return (
    <div className="animate-fade-in-up mt-8 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-[1.4rem] font-extrabold text-slate-50 m-0">Reseñas y Calificaciones</h3>
        <div className="bg-blue-500/10 text-blue-400 py-1 px-3 rounded-2xl font-bold text-sm">
          {averageRating} ★ ({totalReviews})
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
        {/* LISTA DE RESEÑAS */}
        <div className="flex flex-col gap-5">
          {reviews.length === 0 ? (
            <p className="text-slate-500 italic">
              Aún no hay reseñas. ¡Sé el primero en calificar!
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-slate-900/40 backdrop-blur-[20px] saturate-[180%] border border-white/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.05)] p-5 rounded-2xl relative"
              >
                <div className="flex gap-4 items-start">
                  {review.user?.profilePicture ? (
                    <img
                      src={getImageUrl(review.user.profilePicture)}
                      alt={review.user.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                    />
                  ) : (
                    <FaUserCircle className="text-[2.5rem] text-slate-600" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="m-0 text-[0.95rem] text-slate-100">
                        {review.user?.username || 'Usuario'}
                      </h4>
                      <div className="flex text-amber-400 text-sm">
                        {[...Array(5)].map((_, i) =>
                          i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />,
                        )}
                      </div>
                    </div>
                    <p className="my-2 text-[0.85rem] text-slate-400 leading-relaxed">
                      {review.comment}
                    </p>
                    <span className="text-xs text-slate-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {(user?.role === 'ADMIN_ROLE' ||
                    review.user?.uid === user?.uid ||
                    review.user?._id === user?.uid) && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="bg-transparent border-none text-red-500 cursor-pointer p-2 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* FORMULARIO PARA AGREGAR RESEÑA */}
        {!userHasReviewed && (
          <div className="bg-slate-900/60 backdrop-blur-[40px] saturate-[220%] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6),inset_0_1px_1px_0_rgba(255,255,255,0.1)] p-6 rounded-3xl h-fit">
            <h4 className="m-0 mb-5 text-white text-lg">Escribe tu reseña</h4>
            <form onSubmit={handleAddReview}>
              <div className="mb-5">
                <label className="block text-slate-400 text-sm mb-2">Calificación</label>
                <div className="flex gap-2 text-[1.4rem] text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="cursor-pointer"
                    >
                      {star <= newReview.rating ? <FaStar /> : <FaRegStar />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-2">Tu comentario</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  maxLength={500}
                  placeholder="¿Qué te pareció este material?..."
                  className="w-full min-h-[100px] bg-black/20 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white font-extrabold border-none cursor-pointer shadow-[0_8px_16px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
