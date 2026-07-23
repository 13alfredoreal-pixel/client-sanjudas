import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { FaUsers, FaBook, FaComment, FaBolt, FaHistory } from 'react-icons/fa';
import { getImageUrl, getSignedPdfUrl } from '../services/apiService';
import toast from 'react-hot-toast';

/**
 * AdminPage: panel de administración de la biblioteca.
 * Permite a los administradores subir nuevos libros PDF y eliminar los existentes.
 */
const SUGGESTED_EMOJIS = [
  { emoji: '📐', label: 'Matemáticas' },
  { emoji: '🧮', label: 'Cálculo' },
  { emoji: '🔬', label: 'Ciencias' },
  { emoji: '🧪', label: 'Química' },
  { emoji: '⚛️', label: 'Física' },
  { emoji: '📚', label: 'Literatura' },
  { emoji: '📜', label: 'Historia' },
  { emoji: '🎨', label: 'Arte' },
  { emoji: '🎵', label: 'Música' },
  { emoji: '💻', label: 'Tecnología' },
  { emoji: '🌍', label: 'Geografía' },
  { emoji: '⚽', label: 'Deportes' },
  { emoji: '🇬🇧', label: 'Inglés' },
  { emoji: '⚖️', label: 'Derecho' },
  { emoji: '🧠', label: 'Psicología' },
  { emoji: '💰', label: 'Economía' },
];

export const AdminPage = ({ user }) => {
  const navigate = useNavigate();
  const {
    books,
    loading,
    uploading,
    deleting,
    allUsers,
    promoting,
    categories,
    creatingCategory,
    categoryForm,
    setCategoryForm,
    analytics,
    form,
    pdfFile,
    setPdfFile,
    coverFile,
    setCoverFile,
    handleFormChange,
    handleSubmit,
    handleDelete,
    handlePromote,
    handleDeleteUser,
    handleCreateCategory,
    handleDeleteCategory,
  } = useAdmin(user);

  const openBookPdf = async (bookId) => {
    const result = await getSignedPdfUrl(bookId);
    if (result.error || !result.signedUrl) {
      toast.error(result.message || 'No se pudo abrir el PDF');
      return;
    }
    window.open(result.signedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen p-8 box-border max-w-[1100px] mx-auto">
      {/* HEADER */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate('/')}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 text-slate-400 cursor-pointer text-sm font-inherit hover:bg-white/10 transition-colors"
          >
            ← Catálogo
          </button>
          <h1 className="m-0 text-[1.8rem] font-extrabold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Panel de Administrador
          </h1>
        </div>
        <p className="text-slate-500 m-0">
          Gestiona los libros de la biblioteca digital · {books.length} libro
          {books.length !== 1 ? 's' : ''} registrado{books.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* SECCIÓN DE ANALÍTICAS / STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FaUsers />}
          title="Usuarios"
          value={analytics?.stats?.totalUsers || '...'}
          color="from-blue-500/20 to-cyan-500/20"
          textColor="text-cyan-400"
        />
        <StatCard
          icon={<FaBook />}
          title="Libros"
          value={analytics?.stats?.totalBooks || '...'}
          color="from-purple-500/20 to-pink-500/20"
          textColor="text-purple-400"
        />
        <StatCard
          icon={<FaComment />}
          title="Reseñas"
          value={analytics?.stats?.totalReviews || '...'}
          color="from-amber-500/20 to-orange-500/20"
          textColor="text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] gap-8 items-start">
        {/* LIBROS POPULARES Y ACTIVIDAD RECIENTE */}
        <div className="glass-premium rounded-3xl p-7 col-span-full mb-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-slate-50 font-bold mb-4 flex items-center gap-2">
              <FaBolt className="text-yellow-400" /> Libros más comentados
            </h3>
            <div className="flex flex-col gap-3">
              {analytics?.mostReviewedBooks?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5"
                >
                  <div className="w-10 h-12 bg-slate-800 rounded flex items-center justify-center text-xs">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-slate-200 font-bold text-sm truncate">
                      {item.bookDetails.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{item.reviewCount} reseñas</span>
                      <span>⭐ {item.avgRating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-slate-50 font-bold mb-4 flex items-center gap-2">
              <FaHistory className="text-blue-400" /> Registro de Auditoría (Reciente)
            </h3>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {analytics?.recentAuditLogs?.map((log) => (
                <div
                  key={log._id}
                  className="text-[11px] bg-black/20 p-2 rounded-xl border border-white/5"
                >
                  <span className="text-purple-400 font-bold mr-2">{log.action}</span>
                  <span className="text-slate-400">
                    {log.details
                      ? typeof log.details === 'string'
                        ? log.details
                        : JSON.stringify(log.details)
                      : ''}
                  </span>
                  <div className="text-slate-600 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE GESTIÓN DE USUARIOS: Permite al admin promover a otros */}
        <div className="glass-premium rounded-3xl p-7 col-span-full mb-4">
          <h2 className="m-0 mb-6 text-lg text-slate-50 font-bold">
            👥 Gestión de Roles (Hacer Administrador)
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {allUsers
              .filter((u) => u.role !== 'ADMIN_ROLE')
              .map((u) => (
                <div
                  key={u._id || u.uid}
                  className="glass-effect rounded-2xl p-4 flex items-center gap-4"
                >
                  <img
                    src={
                      getImageUrl(u.profilePicture) ||
                      `https://ui-avatars.com/api/?name=${u.username}&background=random`
                    }
                    alt={u.username}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${u.username}&background=random`;
                    }}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex-1">
                    <p className="m-0 font-bold text-slate-50 text-[0.9rem]">{u.username}</p>
                    <p className="m-0 text-xs text-slate-400">
                      {u.name} {u.surname}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePromote(u._id || u.uid)}
                    disabled={promoting === (u._id || u.uid)}
                    className={`bg-gradient-to-br from-indigo-500 to-purple-500 border-none rounded-xl px-3 py-1.5 text-white font-bold text-[0.7rem] transition-colors ${promoting === (u._id || u.uid) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                  >
                    {promoting === (u._id || u.uid) ? '⌛' : 'Hacer Admin'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u._id || u.uid, u.username)}
                    title="Eliminar usuario"
                    className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-3 py-1.5 cursor-pointer text-sm hover:bg-red-500/20 transition-colors"
                  >
                    🗑
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* SECCIÓN DE GESTIÓN DE CATEGORÍAS */}
        <div className="glass-premium rounded-3xl p-7 col-span-full mb-4">
          <h2 className="m-0 mb-6 text-lg text-slate-50 font-bold">🏷️ Gestión de Categorías</h2>

          <form onSubmit={handleCreateCategory} className="flex flex-col gap-4 mb-8">
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Nombre (ej. Matemáticas)"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 text-sm outline-none box-border focus:border-purple-400 transition-colors"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 text-slate-50 text-lg outline-none box-border focus:border-purple-400 text-center transition-colors"
                  required
                  maxLength={2}
                />
                <button
                  type="submit"
                  disabled={creatingCategory}
                  className={`bg-gradient-to-br from-indigo-500 to-purple-500 border-none rounded-xl py-2.5 px-6 text-white font-bold text-sm shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all ${creatingCategory ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                >
                  {creatingCategory ? '✅' : 'Crear'}
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <p className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-wider m-0 mb-3">
                Sugerencias de Materias:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_EMOJIS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, icon: item.emoji })}
                    title={item.label}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all text-xl border ${categoryForm.icon === item.emoji ? 'bg-purple-500/20 border-purple-400/50 scale-110' : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/20'}`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <div
                key={c._id}
                className="bg-white/5 border border-white/10 rounded-xl pl-4 pr-1 py-1 flex items-center gap-3"
              >
                <span className="text-slate-50 font-semibold text-sm">
                  {c.icon} {c.name}
                </span>
                <button
                  onClick={() => handleDeleteCategory(c._id, c.name)}
                  className="w-7 h-7 flex items-center justify-center bg-red-500/10 text-red-400 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors border-none"
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <span className="text-slate-400 text-sm italic">No hay categorías. Crea una.</span>
            )}
          </div>
        </div>

        {/* FORMULARIO DE SUBIDA */}
        <div className="glass-premium rounded-3xl p-7">
          <h2 className="m-0 mb-6 text-lg text-slate-50 font-bold">➕ Subir Nuevo Libro</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 text-[0.78rem] font-semibold text-slate-400 tracking-[0.04em]">
                Título *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Título del libro"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 text-sm outline-none box-border focus:border-purple-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[0.78rem] font-semibold text-slate-400 tracking-[0.04em]">
                Autor *
              </label>
              <input
                name="author"
                value={form.author}
                onChange={handleFormChange}
                placeholder="Nombre del autor"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 text-sm outline-none box-border focus:border-purple-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[0.78rem] font-semibold text-slate-400 tracking-[0.04em]">
                Materia (Categoría)
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 text-sm outline-none box-border cursor-pointer focus:border-purple-400 transition-colors"
                required
              >
                <option value="" disabled className="bg-slate-900">
                  Selecciona una categoría
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name} className="bg-slate-900 text-slate-50">
                    {c.name}
                  </option>
                ))}
                {!categories.some((c) => c.name === 'Otros') && (
                  <option value="Otros" className="bg-slate-900 text-slate-50">
                    Otros
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[0.78rem] font-semibold text-slate-400 tracking-[0.04em]">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Breve descripción del libro..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 text-sm outline-none box-border resize-y leading-relaxed focus:border-purple-400 transition-colors"
              />
            </div>

            <div>
              <label className="block mb-1 text-[0.78rem] font-semibold text-slate-400 tracking-[0.04em]">
                Archivo PDF * (máx. 50 MB)
              </label>
              <input
                id="pdf-input"
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 text-sm outline-none box-border focus:border-purple-400 transition-colors"
              />
              {pdfFile && (
                <p className="mt-1 mb-0 text-[0.72rem] text-blue-400">✓ {pdfFile.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-[0.78rem] font-semibold text-slate-400 tracking-[0.04em]">
                Portada (opcional, imagen)
              </label>
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 text-sm outline-none box-border focus:border-purple-400 transition-colors"
              />
              {coverFile && (
                <p className="mt-1 mb-0 text-[0.72rem] text-blue-400">✓ {coverFile.name}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`mt-2 bg-gradient-to-br from-indigo-500 to-purple-500 border-none rounded-xl py-3 px-6 text-white font-bold text-sm shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all ${uploading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
            >
              {uploading ? '⏳ Subiendo...' : '📤 Subir Libro'}
            </button>
          </form>
        </div>

        {/* LISTA DE LIBROS */}
        <div>
          <h2 className="m-0 mb-5 text-lg text-slate-50 font-bold">📚 Libros en la Biblioteca</h2>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-skeleton h-20 rounded-2xl" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="glass-effect rounded-3xl p-8 text-center text-slate-500">
              <p className="text-3xl m-0 mb-2">📭</p>
              <p className="m-0">No hay libros todavía. ¡Sube el primero!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="glass-effect rounded-2xl py-4 px-5 flex items-center gap-4"
                >
                  {/* Portada miniatura */}
                  <div
                    className="w-12 h-16 rounded-lg shrink-0 flex items-center justify-center text-xl"
                    style={{
                      background: book.coverUrl
                        ? `url(${book.coverUrl}) center/cover`
                        : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    }}
                  >
                    {!book.coverUrl && '📘'}
                  </div>

                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    <p className="m-0 font-bold text-slate-50 text-[0.95rem] overflow-hidden text-ellipsis whitespace-nowrap">
                      {book.title}
                    </p>
                    <p className="mt-0.5 mb-0 mx-0 text-sm text-slate-400">
                      {book.author} · <span className="text-purple-400">{book.category}</span>
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openBookPdf(book._id)}
                      className="bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap hover:bg-blue-500/20 transition-colors cursor-pointer font-inherit"
                    >
                      Ver PDF
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      disabled={deleting === book._id}
                      className={`bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-3 py-1.5 text-xs font-semibold font-inherit transition-colors ${deleting === book._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-red-500/20'}`}
                    >
                      {deleting === book._id ? '...' : '🗑 Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, textColor }) => (
  <div
    className={`glass-premium p-6 rounded-3xl flex items-center gap-5 border border-white/5 bg-gradient-to-br ${color}`}
  >
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-black/20 ${textColor} border border-white/5`}
    >
      {icon}
    </div>
    <div>
      <p className="m-0 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <p className={`m-0 text-3xl font-black ${textColor} leading-none`}>{value}</p>
    </div>
  </div>
);
