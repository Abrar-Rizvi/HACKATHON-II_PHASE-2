// frontend/src/app/(auth)/signup/page.tsx
'use client';

import React, { useState } from 'react';
import SignupForm from '../../../components/auth/SignupForm';
import { SignUpData } from '../../../types/auth';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth(); // Use the auth context
  const router = useRouter();

  const handleSignup = async (data: SignUpData) => {
    setLoading(true);
    setError('');

    try {
      await signUp(data); // Use the auth context signUp function

      // Redirect to login page after successful signup (do not auto-login)
      router.push('/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-saas-bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-saas-primary-blue">Create Account</h1>
          <p className="mt-2 text-saas-secondary-teal">Join us to get started</p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          <SignupForm onSubmit={handleSignup} loading={loading} error={error} />
        </div>
        <p className="mt-6 text-center text-sm text-saas-secondary-teal">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-saas-primary-blue hover:text-saas-primary-blue/80 transition-colors duration-200">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;