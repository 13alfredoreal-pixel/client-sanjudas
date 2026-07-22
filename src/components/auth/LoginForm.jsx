import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import logo from "../../assets/img/logo.png";

export const LoginForm = ({ onToggleForm, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { login, loading, error, clearError } = useLogin();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);

    if (result.success) {
      if (onLoginSuccess) {
        onLoginSuccess(result.data.userDetails);
      }
    } else {
      console.error("Error en login:", result.error);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-4 animate-fade-in-up">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-white/5 rounded-3xl backdrop-blur-md shadow-inner mb-6 transition-transform hover:scale-110">
              <img
                src={logo}
                alt="Logo"
                className="w-20 h-20 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-white/60 font-medium">
              Biblioteca Digital Escolar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-2xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 group-focus-within:text-blue-400 transition-colors">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none placeholder:text-white/20"
                  placeholder="Tu nombre de usuario"
                  required
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 group-focus-within:text-blue-400 transition-colors">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none placeholder:text-white/20"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="#!" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              className="w-full flex justify-center py-4 px-4 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:bg-blue-500 transition-all transform hover:-translate-y-1 active:scale-95"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </button>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium">
                <span className="bg-transparent px-4 text-white/40">¿Aún no tienes cuenta?</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-4 px-4 rounded-2xl text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              onClick={onToggleForm}
              disabled={loading}
            >
              Crea una cuenta ahora
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}