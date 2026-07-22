import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
            <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                Página no encontrada
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-md">
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
                Volver al Inicio
            </Link>
        </div>
    );
};
