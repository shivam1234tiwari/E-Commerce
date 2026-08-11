import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import API from '../services/api';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const { login } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const { data } = await API.post('/auth/login', { email, password });
        login(data, data.token);
        navigate('/');
      } else {
        await API.post('/auth/register', { name, email, password });
        setShowOtpScreen(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp });
      login(data, data.token);
      navigate('/'); // Redirect to Home Page after OTP verification
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-6 bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200 dark:border-slate-800">
        
        {/* Left Side */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-slate-900 text-white overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
            alt="Showcase"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-indigo-400" />
            <span className="text-xl font-black tracking-wider text-indigo-400">SHOPPULSE</span>
          </div>
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-bold leading-tight">
              {showOtpScreen ? 'Verify Email' : isLogin ? 'Welcome Back!' : 'Start Your Journey.'}
            </h3>
          </div>
          <div className="relative z-10 text-xs text-slate-400">&copy; SHOPPULSE</div>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-12 flex flex-col justify-center">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          {showOtpScreen ? (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <ShieldCheck className="w-6 h-6" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enter OTP Code</h2>
              </div>
              <p className="text-xs text-slate-500">OTP code has been sent to <strong>{email}</strong></p>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 6-Digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center text-lg font-bold tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Verify & Continue to Home
              </button>
            </form>
          ) : (
            /* Login / Register Form */
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {isLogin ? 'Sign In' : 'Create an Account'}
              </h2>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition text-sm mt-2 cursor-pointer"
              >
                {isLogin ? 'Sign In' : 'Send OTP'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already verified? Sign in'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}