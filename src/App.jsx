import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { LibraryNavbar } from './components/layout/LibraryNavbar';
import { useApp } from './hooks/useApp';

export const App = () => {
  const { user, handleLoginSuccess, handleLogout } = useApp();

  return (
    <BrowserRouter>
      {/* En la arquitectura limpia, las condicionales y layouts se separan para mejor legibilidad. */}

      {/* El Navbar solo se renderiza si hay una sesión activa, disponible en todo el dashboard */}
      {user && <LibraryNavbar user={user} onLogout={handleLogout} />}

      {/* Contenedor principal que cede la distribución a las Rutas (AppRoutes) */}
      <div className={user ? "min-h-screen" : ""}>
        <AppRoutes user={user} handleLoginSuccess={handleLoginSuccess} />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: '!bg-slate-900/80 !backdrop-blur-[20px] !saturate-[180%] !border !border-white/10 !text-white !rounded-3xl !shadow-[0_20px_40px_rgba(0,0,0,0.4)] !font-semibold !text-sm !tracking-wide',
          style: {
            background: 'transparent',
            boxShadow: 'none',
            border: 'none',
          },
        }}
      />
    </BrowserRouter>
  );
};
