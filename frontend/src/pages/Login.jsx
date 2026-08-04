import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline } from 'react-icons/io5';
import api from '../api';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isRegister) {
        // Register flow
        const response = await api.post('/register', { username, email, password });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(response.data.user);
        navigate('/menu');
      } else {
        // Login flow
        const response = await api.post('/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(response.data.user);
        navigate('/menu');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md rounded-3xl glass-panel border border-white/10 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-rose-600/20 blur-2xl pointer-events-none" />

        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isRegister ? 'Join FoodieAI' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {isRegister ? 'Create an account to browse and order delicious gourmet food' : 'Sign in to manage cart and track orders'}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username (Only for Register) */}
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Username</label>
              <div className="relative">
                <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Password</label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl glow-button text-white font-bold text-sm transition mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center pt-2 border-t border-white/5 mt-2">
          <p className="text-sm text-gray-400">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer bg-transparent border-0"
            >
              {isRegister ? 'Sign In' : 'Sign Up Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
