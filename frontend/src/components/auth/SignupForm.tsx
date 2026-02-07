// frontend/src/components/auth/SignupForm.tsx
import React, { useState } from 'react';
import { SignUpData } from '../../types/auth';

interface SignupFormProps {
  onSubmit: (data: SignUpData) => void;
  loading?: boolean;
  error?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, loading = false, error }) => {
  const [formData, setFormData] = useState<Omit<SignUpData, 'confirmPassword'>>({
    email: '',
    password: '',
    username: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    onSubmit({ ...formData, confirmPassword });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-saas-primary-blue">Create Account</h2>

      {error && (
        <div className="mb-4 p-3 bg-saas-accent-red/10 border border-saas-accent-red text-saas-accent-red rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-saas-secondary-teal text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-saas-bg-light rounded-lg focus:outline-none focus:ring-2 focus:ring-saas-primary-blue focus:border-saas-primary-blue transition-all duration-200 disabled:opacity-50"
            required
            disabled={loading}
            placeholder="Choose a username"
          />
        </div>

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
              minLength={8}
              disabled={loading}
              placeholder="Create a password"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-saas-secondary-teal text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full px-4 py-3 border border-saas-bg-light rounded-lg focus:outline-none focus:ring-2 focus:ring-saas-primary-blue focus:border-saas-primary-blue transition-all duration-200 disabled:opacity-50"
              required
              minLength={8}
              disabled={loading}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-saas-secondary-teal hover:text-saas-primary-blue"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
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
              Creating Account...
            </span>
          ) : 'Sign Up'}
        </button>
      </form>
    </>
  );
};

export default SignupForm;