// frontend/src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import LoginForm from '../../../components/auth/LoginForm';
import { AuthCredentials } from '../../../types/auth';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth(); // Use the auth context
  const router = useRouter();

  const handleLogin = async (data: AuthCredentials) => {
    setLoading(true);
    setError('');

    try {
      await signIn(data); // Use the auth context signIn method which properly updates the state
      router.push('/dashboard'); // Redirect after context is updated
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-saas-bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-saas-primary-blue">Welcome Back</h1>
          <p className="mt-2 text-saas-secondary-teal">Sign In to your account</p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        </div>
        <p className="mt-6 text-center text-sm text-saas-secondary-teal">
          Don't have an account?{' '}
          <a href="/signup" className="font-semibold text-saas-primary-blue hover:text-saas-primary-blue/80 transition-colors duration-200">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;