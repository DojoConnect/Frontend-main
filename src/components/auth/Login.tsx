'use client';

import { useState } from 'react';
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormFilled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(email, password);
      console.log('Login successful:', response);
      
      // Redirect to dashboard on successful login
      router.push('/dashboard?tab=dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section - hidden on mobile */}
      <div className="hidden md:flex w-1/2 bg-[#E51B1B] justify-center items-center">
        <h1 className="text-white text-4xl font-bold">DojoConnect</h1>
      </div>

      {/* Right section - form */}
      <div className="flex flex-1 justify-center items-center bg-white p-4">
        <div
          className="w-full max-w-md p-6 rounded-xl"
          style={{
            boxShadow: '1px 1px 12px 0 #6D6E711A',
          }}
        >
          <h2 className="text-lg text-[#0F1828] font-semibold mb-6 text-center">
            Log in with your email to gain access
          </h2>

          {/* Email Input */}
         <div className="mb-4">
            <label htmlFor="email" className="block text-[#0F1828] mb-1 text-sm font-medium">
              Email address
            </label>
           <input
  id="email"
  type="email"
  placeholder="Enter your email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className={`w-full rounded-md px-3 placeholder:text-[#0F1828] transition-colors
    ${email ? 'bg-gray-100' : 'bg-white'}
    border border-[#ECE4E4] focus:border-red-500 hover:border-red-500`}
  style={{
    height: '48px',
    fontSize: '12px',
  }}
/>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#0F1828] mb-1 text-sm font-medium">
              Password
            </label>
            <div className="relative">
            <input
  id="password"
  type={showPassword ? 'text' : 'password'}
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className={`w-full rounded-md px-3 placeholder:text-[#0F1828] transition-colors
    ${password ? 'bg-gray-100' : 'bg-white'}
    border border-[#ECE4E4] focus:border-red-500 hover:border-red-500`}
  style={{
    height: '48px',
    fontSize: '12px',
  }}
/>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              >
                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
          </div>
             {/* Forgot password button */}
      <div className="flex justify-end mt-4 mb-2">
    <button
      type="button"
      className="text-red-700 text-sm cursor-pointer"
      onClick={() => router.push('/forgot-password')}
      disabled={loading}
    >
      Forgot password?
    </button>
  </div>

  {/* Error message */}
  {error && (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
      {error}
    </div>
  )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className={`w-full h-[55px] text-white font-semibold py-2 rounded-md ${
              isFormFilled && !loading ? '' : 'bg-red-300'
            }`}
            style={{
              backgroundColor: (isFormFilled && !loading) ? '#E51B1B' : '#FCA5A5',
            }}
            disabled={!isFormFilled || loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
