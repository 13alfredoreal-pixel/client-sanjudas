import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { UserIcon, ShieldCheckIcon, PhotoIcon, KeyIcon } from '@heroicons/react/24/outline';

/**
 * SettingsPage:
 * Página para gestionar y editar la información de la cuenta.
 * Permite cambiar datos personales, subir una biografía y actualizar la seguridad.
 */
export const SettingsPage = () => {
    const {
        user, formData, passwordData, previewUrl, loading, activeTab, setActiveTab,
        handleInputChange, handlePasswordChange, handleFileChange,
        handleUpdateProfile, handleUpdatePassword
    } = useSettings();

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
            {/* ENCABEZADO */}
            <div className="mb-12">
                <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Configuración</h1>
                <p className="text-white/60 font-medium">Personaliza tu cuenta y ajusta tu seguridad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* BARRA LATERAL (Pestañas) */}
                <div className="md:col-span-1 space-y-3">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'profile'
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 shadow-lg'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <UserIcon className="w-5 h-5" />
                        <span>Perfil</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'security'
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>Seguridad</span>
                    </button>
                </div>

                {/* AREA DE CONTENIDO (Formularios) */}
                <div className="md:col-span-3">
                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-12 shadow-2xl border border-white/10">
                        {activeTab === 'profile' ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-10">
                                {/* SECCIÓN DE FOTO DE PERFIL */}
                                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-6 sm:space-y-0 sm:space-x-10 pb-10 border-b border-white/10">
                                    <div className="relative group">
                                        <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white/5 relative">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl shadow-2xl cursor-pointer hover:bg-blue-500 transition-all border border-blue-400/20 transform hover:scale-110 active:scale-90">
                                            <PhotoIcon className="w-5 h-5 text-white" />
                                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left pt-2">
                                        <h3 className="text-2xl font-bold text-white mb-1">@{formData.username}</h3>
                                        <p className="text-white/40 text-sm mb-6">{user.email}</p>
                                        <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-wider border border-blue-500/20">
                                            Nivel {user.role === 'ADMIN_ROLE' ? 'Moderador' : 'Lector'}
                                        </span>
                                    </div>
                                </div>

                                {/* CAMPOS DE TEXTO */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Nombre</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Tu nombre"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Apellido</label>
                                        <input
                                            type="text"
                                            name="surname"
                                            placeholder="Tu apellido"
                                            value={formData.surname}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Nombre de Usuario</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Nombre de usuario"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Teléfono</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="8888-8888"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium"
                                        />
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Biografía</label>
                                        <textarea
                                            name="bio"
                                            rows="3"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Cuenta algo sobre ti... (Máximo 150 caracteres)"
                                            maxLength="150"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium resize-none"
                                        />
                                        <p className="text-[9px] text-right text-white/30 font-bold uppercase tracking-widest">{formData.bio.length}/150</p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-500/30 hover:bg-blue-500 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Sincronizando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleUpdatePassword} className="space-y-8">
                                {/* CAMBIO DE CONTRASEÑA */}
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="p-4 bg-blue-600/10 rounded-[1.5rem] border border-blue-500/20">
                                        <KeyIcon className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Gestión de Seguridad</h3>
                                        <p className="text-sm text-white/40">Actualiza tu contraseña para mantener tu cuenta segura.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Confirmar</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-white/20 font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-blue-400 hover:text-white hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Verificando...' : 'Cambiar Contraseña'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
