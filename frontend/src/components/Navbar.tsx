'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

interface NavItem {
  name: string;
  href: string;
}

interface NavbarProps {
  logoText?: string;
  navLinks?: NavItem[];
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  logoText = 'Todo App',
  navLinks = [],
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user: currentUser, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    signOut();
    if (onLogout) {
      onLogout();
    }
  };

  // Default navigation links if none provided
  const defaultNavLinks: NavItem[] = navLinks.length > 0
    ? navLinks
    : [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        ...(currentUser ? [] : [
          { name: 'Login', href: '/login' },
          { name: 'Sign Up', href: '/signup' }
        ]),
        ...(currentUser ? [
          { name: 'Dashboard', href: '/dashboard' }
        ] : [])
      ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">{logoText}</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {defaultNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile Dropdown */}
          {currentUser && (
            <div className="hidden md:flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Hi, {currentUser.username || currentUser.email}</span>
                  <div className="relative">
                    <button
                      type="button"
                      className="bg-gray-200 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                        {currentUser.username?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {defaultNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              >
                {link.name}
              </Link>
            ))}

            {currentUser && (
              <>
                <div className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500">
                  Hi, {currentUser.username || currentUser.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;