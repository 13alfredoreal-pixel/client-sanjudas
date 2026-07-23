import React from 'react';
import { useProfile } from '../hooks/useProfile';
import {
  FaUserEdit,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaBook,
  FaQuoteLeft,
  FaTrashAlt,
} from 'react-icons/fa';

/**
 * ProfilePage:
 * Componente dedicado exclusivamente a visualizar la información del usuario.
 * Utiliza un diseño de Glassmorphism (cristal) para una estética premium.
 */
export const ProfilePage = ({ user: propUser }) => {
  const { user, profileImage, navigate, handleDeleteAccount } = useProfile(propUser);

  return (
    <div className="relative min-height-screen overflow-hidden">
      {/* ELEMENTOS DECORATIVOS DE FONDO (PARTÍCULAS) */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full animate-pulse delay-700"></div>

      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in-up relative z-10">
        {/* TARJETA DE ENCABEZADO (Header) */}
        <div className="relative group overflow-hidden rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl mb-8">
          {/* Elemento decorativo de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full translate-x-32 -translate-y-32"></div>

          <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
            {/* AVATAR CON BRILLO (Glow) */}
            <div className="relative">
              <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 relative z-10">
                <img
                  src={profileImage}
                  alt={user.username}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user.username || 'U'}&background=random`;
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-110 z-0"></div>
            </div>

            {/* INFORMACIÓN BÁSICA */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                  {user.role === 'ADMIN_ROLE' ? 'Administrador' : 'Miembro de la Comunidad'}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                {user.name} <span className="text-blue-400">{user.surname}</span>
              </h1>

              <p className="text-white/60 text-lg font-medium flex items-center justify-center md:justify-start gap-2">
                @{user.username}
              </p>

              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <button
                  onClick={() => navigate('/ajustes')}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all transform active:scale-95 shadow-xl"
                >
                  <FaUserEdit />
                  Editar Perfil
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
                >
                  <FaTrashAlt />
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CUADRICULA DE BIOGRAFÍA Y ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* TARJETA DE BIOGRAFÍA */}
          <div className="md:col-span-3 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FaQuoteLeft className="text-blue-500" /> Biografía
            </h3>
            <p className="text-white/90 text-lg leading-relaxed font-semibold italic">
              {user.bio ||
                'Este usuario prefiere mantener el misterio... (Aún no ha escrito su biografía).'}
            </p>
          </div>
        </div>

        {/* TARJETA DE INFORMACIÓN DE CONTACTO */}
        <div className="md:col-span-3 rounded-[2.5rem] bg-slate-900/20 backdrop-blur-xl border border-white/5 p-8 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all border border-white/5 group-hover:border-blue-500/20">
              <FaEnvelope />
            </div>
            <div>
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                Email
              </div>
              <div className="text-white font-bold truncate max-w-[150px]">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all border border-white/5 group-hover:border-blue-500/20">
              <FaPhone />
            </div>
            <div>
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                Teléfono
              </div>
              <div className="text-white font-bold">{user.phone || 'No registrado'}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all border border-white/5 group-hover:border-blue-500/20">
              <FaCalendarAlt />
            </div>
            <div>
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                Se unió el
              </div>
              <div className="text-white font-bold">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
