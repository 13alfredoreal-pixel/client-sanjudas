import React from 'react';
import { useParams } from 'react-router-dom';
import { useBookViewer } from '../hooks/useBookViewer';
import { Document, Page } from 'react-pdf';
import { FaStar, FaCommentDots, FaTrash, FaTimes } from 'react-icons/fa';
//import { getPdfProxyUrl } from '../services/apiService';

/**
 * BookViewerPage: Visor de PDF premium con vista de dos páginas (estilo libro).
 * El PDF se renderiza en <canvas> para mayor seguridad y control estético.
 */
export const BookViewerPage = ({ user }) => {
  const { id } = useParams();
  const {
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
  } = useBookViewer(id, user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] flex-col gap-6">
        <div className="shimmer w-20 h-20 rounded-full animate-[shimmer_1.5s_infinite] bg-[linear-gradient(90deg,#1e293b_25%,#334155_50%,#1e293b_75%)] bg-[size:200%_100%]" />
        <p className="text-slate-400 font-semibold tracking-widest animate-pulse">
          SINCRONIZANDO BIBLIOTECA...
        </p>
        <style>{`
                    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                `}</style>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center p-20 text-slate-400">
        <span className="text-6xl block mb-4">🔖</span>
        <p className="text-xl font-bold mb-6">{error || 'Recurso no disponible'}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-white/5 border border-white/10 rounded-2xl py-2.5 px-6 text-slate-100 cursor-pointer font-bold transition-all duration-200 text-sm hover:bg-white/10"
        >
          Regresar a la Biblioteca
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-6 p-6 bg-slate-950 overflow-hidden">
      {/* BARRA DE PROGRESO SUPERIOR */}
      <div className="fixed top-0 left-0 w-full h-[5px] bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-[width] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: `${(pageNumber / numPages) * 100}%` }}
        />
      </div>

      {/* HEADER INSTITUCIONAL */}
      <div className="glass-effect py-5 px-10 rounded-[2rem] flex items-center gap-8 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative z-30">
        <button
          onClick={() => navigate('/')}
          className="bg-white/5 border border-white/10 rounded-2xl py-2.5 px-6 text-slate-100 cursor-pointer font-bold transition-all duration-200 text-sm hover:bg-white/10"
        >
          ← Salir
        </button>

        <div className="flex-1">
          <h1 className="m-0 text-[1.4rem] font-black text-slate-100 tracking-tight">
            {book.title}
          </h1>
          <p className="m-0 text-blue-400 text-[0.85rem] font-bold uppercase tracking-wide">
            Páginas {pageNumber} {!isMobile && pageNumber < numPages && `& ${pageNumber + 1}`} de{' '}
            {numPages}
          </p>
          <div className="flex items-center gap-3 mt-1 ml-4">
            {!hasReviewed ? (
              <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shadow-lg backdrop-blur-sm group transition-all hover:border-blue-500/30">
                <div className="flex flex-col">
                  <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] leading-none mb-1">
                    Tu opinión importa
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={18}
                        className="cursor-pointer text-slate-600 hover:text-amber-400 transition-all hover:scale-125 active:scale-90"
                        onClick={() => {
                          setUserRating(star);
                          setShowReviews(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-white/10 mx-1" />
                <button
                  onClick={() => setShowReviews(true)}
                  className="bg-transparent border-none flex flex-col items-center cursor-pointer group/btn"
                >
                  <span className="text-white font-black text-sm group-hover/btn:text-blue-400 transition-colors">
                    {reviews.length}
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter group-hover/btn:text-slate-300">
                    Reseñas
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowReviews(true)}
                className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-slate-100 border border-white/10 rounded-2xl px-5 py-2 text-xs font-bold flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02] shadow-xl backdrop-blur-md"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-amber-400 font-black uppercase tracking-[0.2em] mb-1">
                    Promedio General
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-700'
                        }
                        size={12}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-[1px] h-6 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-white font-black text-sm">{averageRating}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">
                    {reviews.length} Reseñas
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 bg-black/30 p-1.5 rounded-xl border border-white/5">
          <ThemeBtn
            active={theme === 'default'}
            onClick={() => setTheme('default')}
            color="#3b82f6"
            title="Vista Normal"
          />
          <ThemeBtn
            active={theme === 'sepia'}
            onClick={() => setTheme('sepia')}
            color="#d4a373"
            title="Modo Lectura Sepia"
          />
          <ThemeBtn
            active={theme === 'night'}
            onClick={() => setTheme('night')}
            color="#1e293b"
            title="Modo Nocturno"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.4, s - 0.1))}
            className="bg-white/5 border border-white/10 rounded-2xl py-1.5 px-5 text-slate-100 cursor-pointer font-bold transition-all duration-200 text-xl flex items-center justify-center hover:bg-white/10"
          >
            -
          </button>
          <button
            onClick={() => setScale((s) => Math.min(2.5, s + 0.1))}
            className="bg-white/5 border border-white/10 rounded-2xl py-1.5 px-5 text-slate-100 cursor-pointer font-bold transition-all duration-200 text-xl flex items-center justify-center hover:bg-white/10"
          >
            +
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DEL LIBRO */}
      <div
        className="flex-1 relative overflow-auto rounded-[2.5rem] border border-white/5 flex flex-col items-center pt-12 px-4 pb-32"
        style={{ background: getBackground() }}
      >
        {/* CAPA PROTECTORA VISUAL (Captura eventos en lectores) */}
        {!isAdmin && <div className="fixed inset-0 z-10 bg-transparent" />}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-slate-500 font-extrabold">CARGANDO MANUSCRITO...</div>}
        >
          <div
            className="flex gap-[15px] transition-[filter] duration-400 ease-in-out [perspective:2000px]"
            style={{ filter: getFilter() }}
          >
            {/* PÁGINA IZQUIERDA */}
            <div className="shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-md overflow-hidden bg-white origin-right transition-transform duration-300">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={isMobile ? window.innerWidth * 0.9 : undefined}
                loading=""
              />
            </div>

            {/* PÁGINA DERECHA (Side-by-side) */}
            {!isMobile && pageNumber + 1 <= numPages && (
              <div className="shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-md overflow-hidden bg-white origin-left">
                <Page
                  pageNumber={pageNumber + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading=""
                />
              </div>
            )}
          </div>
        </Document>

        {/* CONTROLES DE NAVEGACIÓN FLOTANTES */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-6 z-20">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className={`nav-btn bg-blue-900/90 backdrop-blur-md py-3 px-10 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] text-blue-300 font-black border border-blue-500/40 cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] tracking-widest ${pageNumber <= 1 ? 'opacity-20 pointer-events-none' : ''}`}
          >
            Anterior
          </button>
          <div className="bg-slate-900/90 py-3 px-6 border border-blue-500/30 rounded-3xl text-blue-400 font-black backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center">
            {pageNumber} / {numPages}
          </div>
          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className={`nav-btn bg-blue-900/90 backdrop-blur-md py-3 px-10 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] text-blue-300 font-black border border-blue-500/40 cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] tracking-widest ${pageNumber >= numPages ? 'opacity-20 pointer-events-none' : ''}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* OVERLAY PARA CERRAR AL HACER CLIC FUERA */}
      {showReviews && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setShowReviews(false)}
        />
      )}

      {/* PANEL DE RESEÑAS SLIDE-OVER */}
      <div
        className={`fixed top-0 right-0 h-full w-[450px] max-w-full bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${showReviews ? 'translate-x-0' : 'translate-x-[105%]'}`}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <button
            onClick={() => setShowReviews(false)}
            className="flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500/40 transition-all cursor-pointer"
          >
            ← Volver al Lector
          </button>
          <h2 className="text-lg font-black text-slate-50 flex items-center gap-3 m-0">
            <FaCommentDots className="text-blue-400" /> Reseñas
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* POMULARIO DE RESEÑA */}
          {user && !hasReviewed && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 bg-white/5 p-4 rounded-2xl border border-white/5"
            >
              <h3 className="text-sm font-bold text-slate-300 mb-3">Deja tu opinión</h3>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={22}
                    color={star <= userRating ? '#fbbf24' : '#334155'}
                    className="cursor-pointer transition-colors"
                    onClick={() => setUserRating(star)}
                  />
                ))}
              </div>
              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="¿Qué te pareció este material?"
                maxLength={500}
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none resize-none h-24 mb-3 focus:border-blue-500/50"
              />
              <div className="flex flex-col gap-2">
                <button
                  disabled={submittingReview}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  {submittingReview ? 'Publicando...' : 'Publicar Reseña'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviews(false)}
                  className="w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold py-2.5 rounded-xl transition-all text-xs uppercase tracking-widest border border-white/5"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {hasReviewed && (
            <div className="mb-8 flex flex-col gap-3">
              <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-center text-sm font-bold shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                ¡Gracias por tu reseña!
              </div>
              <button
                onClick={() => setShowReviews(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span className="group-hover:-translate-x-1 transition-transform text-lg">📖</span>
                Regresar a la lectura
              </button>
            </div>
          )}

          {/* LISTA DE RESEÑAS */}
          <div className="flex flex-col gap-4">
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-center font-medium my-10">
                Sé el primero en calificar este libro.
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white/5 p-4 rounded-2xl flex gap-4 border border-white/5 relative group"
                >
                  <img
                    src={review.user?.profilePicture}
                    alt={review.user?.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="m-0 font-bold text-slate-200 text-sm">
                        {review.user?.name} {review.user?.surname}
                      </p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            size={10}
                            color={s <= review.rating ? '#fbbf24' : '#334155'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="m-0 text-slate-400 text-xs leading-relaxed">{review.comment}</p>
                    <p className="m-0 text-slate-600 text-[10px] mt-2 font-medium">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {(isAdmin || user?.uid === review.user?._id) && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-transparent border-none"
                      title="Eliminar Reseña"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeBtn = ({ active, onClick, color, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-8 h-8 rounded-xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${active ? 'border-2 border-white scale-110 !rotate-6' : 'border border-transparent hover:-translate-y-1'}`}
    style={{
      background: color,
      boxShadow: active ? `0 0 15px ${color}` : 'none',
    }}
  />
);
