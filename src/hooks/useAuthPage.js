import { useState } from 'react';

export const useAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleRegisterSuccess = () => {
    // Cambiar automáticamente al login después del registro exitoso
    setIsLogin(true);
  };

  return {
    isLogin,
    handleToggleForm,
    handleRegisterSuccess,
  };
};
