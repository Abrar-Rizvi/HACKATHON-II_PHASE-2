'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from './Button';

const Navigation = () => {
  const { user, isAuthenticated, isLoading, error, login, signUp, signOut, verifyToken } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Todo App
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="mx-4 text-gray-700 hover:text-indigo-600">
                  Dashboard
                </Link>
                <span className="mr-4 text-gray-600">Welcome, {user?.email}</span>
                <Button onClick={signOut} variant="secondary">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="mx-4 text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link href="/register" className="mx-4 text-gray-700 hover:text-indigo-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;