'use client'
// frontend/src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { AuthCredentials } from '../../types/auth';

interface LoginFormProps {
  onSubmit: (data: AuthCredentials) => void;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false, error }) => {
  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-saas-primary-blue">Sign In</h2>

      {error && (
        <div className="mb-4 p-3 bg-saas-accent-red/10 border border-saas-accent-red text-saas-accent-red rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-saas-secondary-teal text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-saas-bg-light rounded-lg focus:outline-none focus:ring-2 focus:ring-saas-primary-blue focus:border-saas-primary-blue transition-all duration-200 disabled:opacity-50"
            required
            disabled={loading}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-saas-secondary-teal text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-saas-bg-light rounded-lg focus:outline-none focus:ring-2 focus:ring-saas-primary-blue focus:border-saas-primary-blue transition-all duration-200 disabled:opacity-50"
              required
              disabled={loading}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-saas-secondary-teal hover:text-saas-primary-blue"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-saas-primary-blue focus:ring-saas-primary-blue border-saas-bg-light rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-saas-secondary-teal">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-saas-primary-blue hover:text-saas-primary-blue/80 transition-colors duration-200">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
            loading
              ? 'bg-saas-primary-blue/70 cursor-not-allowed'
              : 'bg-saas-primary-blue hover:bg-[#5a8bad] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saas-primary-blue'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          ) : 'Sign In'}
        </button>
      </form>
    </>
  );
};

export default LoginForm;