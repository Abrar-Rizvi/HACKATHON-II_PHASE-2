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
          { name: 'Sign In', href: '/login' },
          { name: 'Sign Up', href: '/signup' }
        ]),
        ...(currentUser ? [
          { name: 'Dashboard', href: '/dashboard' }
        ] : [])
      ];

  return (
    <nav className="bg-saas-bg-light border-b border-saas-primary-blue/20 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center">
              <span className="text-xl font-bold text-saas-primary-blue">{logoText}</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {defaultNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-saas-secondary-teal hover:text-saas-primary-blue transition-colors duration-200 relative group"
                >
                  {link.name}
                  {/* Animated underline that appears on hover */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-saas-primary-blue scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile Section */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-3">
              {/* Online status indicator */}
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="font-bold text-saas-primary-blue">
                  {currentUser.username || currentUser.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-bold text-saas-accent-red hover:text-white hover:bg-saas-accent-red rounded-md transition-colors duration-200"
              >
              Sign Out
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-saas-secondary-teal hover:text-saas-primary-blue hover:bg-saas-bg-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-saas-primary-blue"
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
                className="block pl-3 pr-4 py-2 text-base font-medium text-saas-secondary-teal hover:text-saas-primary-blue hover:bg-saas-bg-light rounded-md mx-2 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {currentUser && (
              <>
                <div className="block pl-3 pr-4 py-2 text-base font-medium text-saas-primary-blue">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {currentUser.username || currentUser.email?.split('@')[0]}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-saas-accent-red hover:text-white hover:bg-saas-accent-red rounded-md mx-2 transition-colors duration-200"
                >
                  Sign Out
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