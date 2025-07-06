// src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // We will use useAuth now

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, error, clearError } = useAuth(); // Get things from the context
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // This allows redirecting back to the page the user was trying to access
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(clearError) clearError(); // Clear previous errors if the function exists
    
    // The signIn function now handles everything. We don't need any logic after it.
    // The AuthRedirector component will handle navigation.
    const result = await signIn(formData.email, formData.password);

    if (result.success && from) {
      // If login is successful and the user was trying to go somewhere specific, send them there.
      navigate(from, { replace: true });
    }
    // Otherwise, the AuthRedirector on the HomePage will handle the default dashboard redirect.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2><p className="mt-2 text-center text-sm text-gray-600">Or{' '}<Link to="/join-the-movement" className="font-medium text-teal-600 hover:text-teal-500">join the movement</Link></p></div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (<div className="rounded-md bg-red-50 p-4"><div className="text-sm text-red-800">{error}</div></div>)}
          <div className="rounded-md shadow-sm -space-y-px">
            <div><label htmlFor="email" className="sr-only">Email address</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div><input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Email address" /></div></div>
            <div><label htmlFor="password" className="sr-only">Password</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Password"/><button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>{showPassword ? (<EyeOff className="h-5 w-5 text-gray-400" />) : (<Eye className="h-5 w-5 text-gray-400" />)}</button></div></div>
          </div>
          <div className="flex items-center justify-between"><div className="flex items-center"><input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" /><label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label></div><div className="text-sm"><Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">Forgot your password?</Link></div></div>
          <div><button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Signing in...' : 'Sign in'}</button></div>
        </form>
      </div>
    </div>
  );
}