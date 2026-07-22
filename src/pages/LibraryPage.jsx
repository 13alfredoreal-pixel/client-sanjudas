import React from 'react';
import { useLibrary } from '../hooks/useLibrary';
import { FaGraduationCap, FaStar, FaChartLine, FaHeart, FaRegHeart } from 'react-icons/fa';

const COVER_COLORS = [
    'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
];

export const LibraryPage = ({ user }) => {
    const {
        books, favorites, loading, category, setCategory,
        search, searchInput, setSearchInput, page, totalPages, loadingMore,
        handleSearch, handleLoadMore, handleToggleFavorite, displayCategories,
        categoryIcons, stats, navigate
    } = useLibrary(user);

    return (
        <div className="min-h-screen box-border">

            {/* HEROU 2.0: INSTITUCIONAL & ELEGANTE */}
            <div className="hero-gradient pt-24 px-8 pb-20 mb-16 text-center border-b border-white/5 relative overflow-hidden">
                {/* Elementos decorativos */}
                <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)]"></div>
                <div className="absolute -bottom-[10%] -left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)]"></div>

                <div className="animate-fade-in-up relative z-10 max-w-[1200px] mx-auto">
                    <div className="inline-flex items-center gap-3 py-2 px-5 bg-white/5 rounded-full border border-white/10 mb-8 text-blue-400 text-xs font-black tracking-widest uppercase">
                        <FaGraduationCap /> Excelencia Académica
                    </div>

                    <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black bg-gradient-to-br from-white from-40% to-slate-400 bg-clip-text text-transparent m-0 tracking-tight leading-none mb-6">
                        BIBLIOTECA <span className="text-blue-400">INSTITUCIONAL</span>
                    </h1>

                    <p className="text-slate-400 mx-auto mb-12 text-[1.2rem] max-w-[700px] leading-relaxed font-medium">
                        Plataforma digital de alto rendimiento para el acceso a recursos académicos, literatura universal y herramientas de investigación.
                    </p>

                    {/* DASHBOARD DE ESTADÍSTICAS */}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-16 px-4">
                        <StatCard icon={<FaChartLine />} label="Recursos Totales" value={stats.total} color="#3b82f6" />
                        <StatCard icon={<FaGraduationCap />} label="Material Académico" value={stats.featured.length} color="#f59e0b" />
                        <StatCard icon={<FaHeart />} label="Mis Favoritos" value={favorites.length} color="#ec4899" />
                    </div>

                    {/* BUSCADOR */}
                    <form onSubmit={handleSearch} className="flex gap-3 max-w-[800px] mx-auto bg-slate-900/40 p-2.5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                        <div className="relative flex-1">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar en el catálogo institucional..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                className="w-full bg-transparent border-none text-slate-50 outline-none font-inherit pl-12 py-3 text-base"
                            />
                        </div>
                        <button type="submit" className="bg-gradient-to-br from-blue-500 to-purple-500 border-none rounded-[1.1rem] py-3 px-8 text-white font-bold cursor-pointer text-[0.85rem] whitespace-nowrap">
                            Explorar
                        </button>
                    </form>
                </div>
            </div>

            <div className="px-16 pb-24">

                {/* SECCIÓN SPOTLIGHT (DESTACADOS) - Solo se muestra si no hay búsqueda/filtro */}
                {category === 'Todos' && stats.featured.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <h2 className="text-2xl font-black text-slate-50 flex items-center gap-3">
                                <FaStar className="text-amber-500" /> Libros Destacados
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                            {stats.featured.map((book, idx) => (
                                <BookCard
                                    key={`featured-${book._id}`}
                                    book={book}
                                    index={idx}
                                    isFeatured
                                    isFavorite={favorites.includes(book._id)}
                                    onToggleFavorite={handleToggleFavorite}
                                    colorGradient={COVER_COLORS[idx % COVER_COLORS.length]}
                                    onClick={() => navigate(`/libro/${book._id}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* FILTROS CON CONTADORES (Smart Filters) */}
                <div className="flex gap-4 flex-wrap justify-center mb-12">
                    {displayCategories.map((cat, i) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`animate-fade-in-up stagger-${(i % 6) + 1} px-7 py-3 rounded-[1.25rem] text-[0.9rem] flex items-center gap-3 transition-all duration-300 ${category === cat ? 'border border-blue-400/50 bg-blue-500/15 text-white font-extrabold shadow-[0_15px_30px_-10px_rgba(59,130,246,0.3)]' : 'border border-white/5 bg-white/5 text-slate-400 font-semibold cursor-pointer'}`}
                        >
                            <span>{categoryIcons[cat] || '📄'}</span>
                            <span>{cat}</span>
                            <span className={`text-[0.7rem] px-2 py-0.5 rounded-lg opacity-80 ${category === cat ? 'bg-white/20' : 'bg-white/5'}`}>
                                {cat === 'Todos' ? stats.total : (stats.byCategory[cat] || 0)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* CATÁLOGO PRINCIPAL */}
                <div className="flex justify-between items-center mb-10 px-4">
                    <h2 className="text-xl font-black text-slate-50">
                        {search ? `Resultados para "${search}"` : (category === 'Todos' ? 'Catálogo Completo' : `Colección de ${category}`)}
                    </h2>
                    <span className="text-[0.85rem] text-slate-500 font-semibold">{books.length} recursos encontrados</span>
                </div>

                {loading && page === 1 ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-10 max-w-[1400px] mx-auto">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="glass-skeleton h-[400px] rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div className="glass-premium text-center py-32 px-8 text-slate-500 rounded-[3.5rem] max-w-[900px] mx-auto">
                        <div className="text-[5rem] mb-6">🕵️‍♂️</div>
                        <h3 className="text-slate-50 text-[1.75rem] mb-3 font-black">No hay coincidencias en los archivos</h3>
                        <p className="text-[1.1rem] max-w-[500px] mx-auto mb-10">Lo sentimos, no pudimos encontrar lo que buscas en nuestra base de datos institucional.</p>
                        <button
                            onClick={() => { setCategory('Todos'); setSearch(''); setSearchInput(''); }}
                            className="bg-white/5 border border-white/10 py-4 px-10 rounded-[1.25rem] text-slate-50 font-extrabold cursor-pointer transition-colors hover:bg-white/10"
                        >
                            Restablecer Colección
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 max-w-[1400px] mx-auto w-full">
                            {books.map((book, idx) => (
                                <BookCard
                                    key={`${book._id}-${idx}`} // appended idx to ensure uniqueness if duplication occurs
                                    book={book}
                                    index={idx}
                                    categoryIcons={categoryIcons}
                                    isFavorite={favorites.includes(book._id)}
                                    onToggleFavorite={handleToggleFavorite}
                                    colorGradient={COVER_COLORS[idx % COVER_COLORS.length]}
                                    onClick={() => navigate(`/libro/${book._id}`)}
                                />
                            ))}
                        </div>

                        {/* Botón Cargar Más */}
                        {page < totalPages && (
                            <button 
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className={`mt-14 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold py-3 px-10 rounded-[2rem] border-none cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.4)] transition-all ${loadingMore ? 'opacity-70 scale-95 cursor-wait' : ''}`}
                            >
                                {loadingMore ? 'Cargando más...' : 'Cargar Más Archivos'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="glass-effect p-6 rounded-[1.5rem] border-l-4 transition-transform duration-300 hover:-translate-y-1"
        style={{ borderLeftColor: color }}
    >
        <div className="text-2xl mb-2" style={{ color }}>{icon}</div>
        <div className="text-2xl font-black text-slate-50">{value}</div>
        <div className="text-[0.7rem] text-slate-400 uppercase font-extrabold tracking-wide">{label}</div>
    </div>
);

const BookCard = ({ book, index, colorGradient, onClick, isFeatured, isFavorite, onToggleFavorite, categoryIcons }) => {
    return (
        <div
            className={`glass-card animate-fade-in-up stagger-${(index % 6) + 1} flex flex-col h-full cursor-pointer border border-white/5 transition-all duration-300`}
            onClick={onClick}
        >
            {/* PORTADA */}
            <div 
                className="h-[140px] rounded-t-[1rem] relative overflow-hidden flex items-center justify-center"
                style={{ background: book.coverUrl ? `url(${book.coverUrl}) center/cover` : colorGradient }}
            >
                {!book.coverUrl && <span className="text-3xl">📘</span>}

                {/* Badge de Categoría */}
                <div className="absolute top-5 right-5 bg-slate-900/70 backdrop-blur-md rounded-xl px-3 py-1.5 text-[0.7rem] text-white font-extrabold border border-white/10 flex items-center gap-1.5">
                    <span>{categoryIcons?.[book.category] || '📄'}</span>
                    {book.category}
                </div>
            </div>

            {/* INFO */}
            <div className="p-3 flex-1 flex items-end gap-2">
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    <h3 className="m-0 text-[0.85rem] font-extrabold text-slate-50 leading-tight line-clamp-2">
                        {book.title}
                    </h3>
                    <p className="m-0 text-[0.7rem] font-semibold text-blue-400 whitespace-nowrap overflow-hidden text-ellipsis">
                        {book.author}
                    </p>
                </div>

                {/* Botón de Favorito - Movido abajo */}
                <div
                    onClick={(e) => onToggleFavorite(e, book._id)}
                    className={`w-[2.2rem] h-[2.2rem] rounded-[0.6rem] flex items-center justify-center transition-all duration-300 shrink-0 border ${isFavorite ? 'bg-pink-500/15 text-pink-500 border-pink-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`}
                >
                    {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                </div>
            </div>
        </div>
    );
};

