import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * ==============================================================================
 * 👑 COMPONENTE "ADMIN ROUTE" (RUTAS DE ADMINISTRADOR)
 * ==============================================================================
 * Añade una segunda capa de seguridad. Verifica que el usuario que intenta
 * abrir la dirección tenga específicamente el rol de administrador.
 * Si intenta pasar de 'listo' y no es Admin, lo regresamos a su dashboard normal (`/`).
 */
export const AdminRoute = ({ user, redirectPath = '/' }) => {
  if (user?.role !== 'ADMIN_ROLE') {
    toast.error('Acceso denegado: Se requieren permisos de administrador');
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
