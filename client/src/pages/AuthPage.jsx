// client/src/pages/AuthPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import API from '../services/api';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const { setUser } = useContext(ShopContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('auth'); // 'auth' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // 1. Handle Login & Register (Send OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isLogin) {
        // Direct Login -> /api/auth/login
        const { data } = await API.post('/auth/login', {
          email: cleanEmail,
          password,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        navigate(data.isAdmin ? '/admin' : '/');
      } else {
        // Register & Send Real OTP -> /api/auth/register
        const { data } = await API.post('/auth/register', {
          name: name.trim(),
          email: cleanEmail,
          password,
        });

        setMessage(data.message || 'OTP sent to your email address!');
        setStep('otp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post('/auth/verify-otp', {
        email: cleanEmail,
        otp: cleanOtp,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Google OAuth Login
  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await API.post('/auth/google', {
        mockUser: {
          name: 'Google Verified Shopper',
          email: 'google.shopper@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
        },
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {step === 'otp' ? 'Verify OTP' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 'otp'
              ? `Enter the 6-digit code sent to ${email}`
              : isLogin
              ? 'Enter your credentials to continue shopping'
              : 'Join ShopPulse for exclusive deals and express checkout'}
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="p-3.5 mb-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3.5 mb-4 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-100">
            {message}
          </div>
        )}

        {step === 'auth' ? (
          <div className="space-y-4">
            {/* Google Login */}
            <button
              onClick={handleGoogleAuth}
              type="button"
              disabled={loading}
              className="w-full py-3 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-3 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="grow h-px bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">or</span>
              <div className="grow h-px bg-slate-200 dark:bg-slate-800"></div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Continue with Email'} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setMessage('');
                }}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                6-Digit Security OTP
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center tracking-widest text-base font-black outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Log In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('auth');
                  setError('');
                  setMessage('');
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}