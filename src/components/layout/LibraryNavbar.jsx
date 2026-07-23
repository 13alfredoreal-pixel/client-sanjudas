import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/apiService';
import logo from '../../assets/img/logo.png';

/**
 * LibraryNavbar: barra de navegación principal de la Biblioteca Digital.
 * Muestra el nombre de la institución, el usuario activo, su rol, y botón de logout.
 */
export const LibraryNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  // Determinamos si el usuario es administrador para mostrar opciones especiales
  const isAdmin = user?.role === 'ADMIN_ROLE';

  return (
    <nav className="sticky top-0 z-[100] w-full py-3 px-8 flex items-center justify-between border-b border-white/10 box-border bg-slate-900/40 backdrop-blur-[20px] saturate-[180%] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.05)]">
      {/* SECCIÓN DEL LOGO: Regresa al catálogo principal */}
      <Link to="/" className="flex items-center gap-3 no-underline">
        <img
          src={logo}
          alt="Biblioteca Virtual SJT"
          className="w-10 h-10 rounded-full object-cover shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        />
        <div>
          <p className="m-0 font-bold text-base text-slate-50">Biblioteca Virtual SJT</p>
          <p className="m-0 text-[0.65rem] text-slate-400 tracking-[0.1em]">SAN JUDAS TADEO</p>
        </div>
      </Link>

      {/* ENLACES DE NAVEGACIÓN (centro): Agregado link a Perfil */}
      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="text-slate-300 no-underline text-sm font-medium transition-colors hover:text-white"
        >
          Catálogo
        </Link>
        {/* Botón para llevar al perfil del usuario */}
        <Link
          to="/perfil"
          className="text-blue-400 no-underline text-sm font-medium transition-colors hover:text-blue-300"
        >
          👤 Perfil
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="text-violet-400 no-underline text-sm font-medium transition-colors hover:text-violet-300"
          >
            ⚙ Panel Admin
          </Link>
        )}
      </div>

      {/* SECCIÓN DERECHA: USUARIO Y LOGOUT JUNTOS */}
      <div className="flex items-center gap-6">
        {/* SECCIÓN DEL USUARIO: Cliqueable para ir al perfil */}
        <div
          onClick={() => navigate('/perfil')}
          className="flex items-center gap-4 cursor-pointer"
          title="Ver mi perfil"
        >
          <div className="flex items-center gap-3">
            <img
              src={
                getImageUrl(user.profilePicture) ||
                `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=random`
              }
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=random`;
              }}
              className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-lg"
            />
            <div className="text-right">
              <p className="m-0 text-[0.85rem] font-semibold text-slate-50">
                {user?.name} {user?.surname}
              </p>
              <span
                className={`shimmer-premium text-[0.6rem] font-black tracking-[0.15em] py-[3px] px-[10px] rounded-lg border uppercase ${
                  isAdmin
                    ? 'text-white bg-gradient-to-br from-violet-400 to-violet-500 border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                    : 'text-blue-400 bg-blue-400/10 border-blue-400/30 shadow-none'
                }`}
              >
                {isAdmin ? 'ADMINISTRADOR' : 'LECTOR'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl py-1.5 px-4 cursor-pointer font-semibold text-[0.8rem] transition-all duration-200 hover:bg-red-500/25 hover:text-white"
        >
          Salir
        </button>
      </div>
    </nav>
  );
};
