import { useState } from 'react';
import { useRegister } from '../../hooks/useRegister';
import logo from '../../assets/img/logo.png';

export const RegisterForm = ({ onToggleForm, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });

  const { register, loading, error, clearError } = useRegister();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePicture') {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(formData);

    if (result.success) {
      if (onRegisterSuccess) {
        onRegisterSuccess(result.data.user);
      }
    } else {
      console.error('Error en registro:', result.error);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-4 animate-fade-in-up">
      <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white/5 rounded-3xl backdrop-blur-md shadow-inner mb-4 transition-transform hover:scale-110">
              <img src={logo} alt="Biblioteca Virtual SJT" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Crea tu cuenta</h2>
            <p className="mt-2 text-white/60 font-medium">Biblioteca Virtual SJT</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-2xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 group-focus-within:text-blue-400 transition-colors">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Tu nombre"
                  required
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 group-focus-within:text-blue-400 transition-colors">
                  Apellido
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Tu apellido"
                  required
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 group-focus-within:text-blue-400 transition-colors">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 group-focus-within:text-blue-400 transition-colors">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="tu@email.com"
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
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 group-focus-within:text-blue-400 transition-colors">
                  Confirmar
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-2">
                Foto de perfil (opcional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-white/70">
                      <span className="font-bold">Sube tu foto</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-white/40">PNG, JPG o GIF</p>
                  </div>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleInputChange}
                    className="hidden"
                    accept="image/*"
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <button
              className="w-full py-4 px-4 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:bg-blue-500 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Comenzar ahora'}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm font-medium text-white/60">
                ¿Ya eres parte de la comunidad?{' '}
                <button
                  type="button"
                  onClick={onToggleForm}
                  className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
