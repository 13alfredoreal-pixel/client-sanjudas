import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ==============================================================================
 * 🛡️ COMPONENTE "PROTECTED ROUTE" (RUTAS PRIVADAS)
 * ==============================================================================
 * Este componente es un estándar profesional en React para proteger rutas.
 * Verifica si existe un usuario; si no lo hay (no autorizado), interrumpe el paso
 * y lo manda a la vista de inicio de sesión (`/login`).
 * Si el usuario es válido, renderiza `<Outlet />` que representa los componentes hijos.
 */
export const ProtectedRoute = ({ user, redirectPath = '/login' }) => {
  if (!user) {
    // Navigate con "replace" reemplaza la ruta en el historial del navegador
    // para que el usuario no pueda "echar hacia atrás" al área privada.
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
