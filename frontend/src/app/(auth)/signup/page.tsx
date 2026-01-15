// frontend/src/app/(auth)/signup/page.tsx
'use client';

import React, { useState } from 'react';
import SignupForm from '../../../components/auth/SignupForm';
import { SignUpData } from '../../../types/auth';
import { authAPI } from '../../../lib/api/auth-api';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (data: SignUpData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signUp(data);

      // Store the token in localStorage
      if (response.token.accessToken) {
        localStorage.setItem('auth_token', response.token.accessToken);
      }

      // Redirect to dashboard or home page after successful signup
      router.push('/dashboard'); // or wherever the user should go after signup
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm onSubmit={handleSignup} loading={loading} error={error} />
    </div>
  );
};

export default SignupPage;