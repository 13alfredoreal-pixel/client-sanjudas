import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LibraryPage } from "../pages/LibraryPage";
import { BookViewerPage } from "../pages/BookViewerPage";
import { AdminPage } from "../pages/AdminPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SettingsPage } from "../pages/SettingsPage";
import { AuthPage } from "../pages/AuthPage";

import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AdminRoute } from "../components/auth/AdminRoute";

export const AppRoutes = ({ user, handleLoginSuccess }) => {
  return (
    <Routes>
      {/* 
        ======================================================
        🌍 RUTAS PÚBLICAS
        ======================================================
        Cualquiera puede entrar aquí. Si ya tienen sesión, los mandamos al inicio cerrado. 
      */}
      <Route 
        path="/login" 
        element={ user ? <Navigate to="/" replace /> : <AuthPage onLoginSuccess={handleLoginSuccess} /> } 
      />

      {/* 
        ======================================================
        🔒 RUTAS PROTEGIDAS (ZONA PRIVADA)
        ======================================================
        Envolvemos todo lo privado usando el patrón <Outlet/> dentro de <ProtectedRoute />.
        Si 'user' no existe, React Router automáticamente denegará todas las vistas hijas y redireccionará.
      */}
      <Route element={<ProtectedRoute user={user} redirectPath="/login" />}>
        
        {/* Vistas generales para cualquier usuario autenticado */}
        <Route path="/" element={<LibraryPage user={user} />} />
        <Route path="/libro/:id" element={<BookViewerPage user={user} />} />
        <Route path="/perfil" element={<ProfilePage user={user} />} />
        <Route path="/ajustes" element={<SettingsPage user={user} />} />

        {/* 
          ======================================================
          👑 RUTAS DE ADMINISTRADOR
          ======================================================
        */}
        <Route element={<AdminRoute user={user} />}>
          <Route path="/admin" element={<AdminPage user={user} />} />
        </Route>
        
      </Route>

      {/* 
        ======================================================
        🔀 RUTAS DESCONOCIDAS O INEXISTENTES
        ======================================================
      */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
};
