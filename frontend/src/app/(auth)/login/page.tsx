// frontend/src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import LoginForm from '../../../components/auth/LoginForm';
import { AuthCredentials } from '../../../types/auth';
import { authAPI } from '../../../lib/api/auth-api';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (data: AuthCredentials) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signIn(data);

      // Store the token in localStorage
      if (response.token.accessToken) {
        localStorage.setItem('auth_token', response.token.accessToken);
      }

      // Redirect to dashboard or home page after successful login
      router.push('/dashboard'); // or wherever the user should go after login
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
};

export default LoginPage;