// src\pages\LoginPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ 
import LoginForm from '../forms/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ 
        const role = decoded?.role;

        if (role === 'admin') navigate('/dashboard', { replace: true });
        else if (role === 'landlord') navigate('/landlord/dashboard', { replace: true });
        else if (role === 'caretaker') navigate('/caretaker/dashboard', { replace: true });
        else navigate('/dashboard', { replace: true }); // fallback
      } catch {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
