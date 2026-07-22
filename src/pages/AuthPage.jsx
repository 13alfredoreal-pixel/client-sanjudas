import React from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuthPage } from "../hooks/useAuthPage";

export const AuthPage = ({ onLoginSuccess }) => {
  const { isLogin, handleToggleForm, handleRegisterSuccess } = useAuthPage();

  const handleLoginSuccess = (user) => {
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  return (
    <>
      {isLogin ? (
        <LoginForm
          onToggleForm={handleToggleForm}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <RegisterForm
          onToggleForm={handleToggleForm}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
}