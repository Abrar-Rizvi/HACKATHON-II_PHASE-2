'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Navbar from '@/components/Navbar';

interface LayoutClientWrapperProps {
  children: React.ReactNode;
}

const LayoutClientWrapper: React.FC<LayoutClientWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      <Navbar />
      <main className="container mx-auto py-6">
        {children}
      </main>
    </AuthProvider>
  );
};

export default LayoutClientWrapper;