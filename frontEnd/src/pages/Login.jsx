import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.usernameOrEmail.trim()) { setError('Email or username is required'); return; }
    if (!formData.password) { setError('Password is required'); return; }

    setLoading(true);
    setError('');
    try {
      const response = await login(formData);
      if (response.status === 'success') {
        // Redirect admin to admin panel, regular users to dashboard
        const loggedInUser = response.user;
        if (loggedInUser?.roles?.includes('ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f2e] to-[#0f1419] flex flex-col lg:flex-row">

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20" />
        <div className="relative z-10 flex flex-col justify-center px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8">
            <h1 className="text-3xl xl:text-4xl font-black text-white mb-3 leading-tight">
              Welcome back to{' '}
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                MentorBridge
              </span>
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              Connect with mentors, share knowledge, and accelerate your career growth.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-5">
            {[
              { icon: CheckCircle, color: 'text-[#6366f1]', bg: 'bg-[#6366f1]/20', title: 'Expert Mentorship', desc: 'Get guidance from industry professionals and alumni' },
              { icon: CheckCircle, color: 'text-[#10b981]', bg: 'bg-[#10b981]/20', title: 'Knowledge Sharing', desc: 'Ask questions and share your expertise with the community' },
              { icon: CheckCircle, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/20', title: 'Career Growth', desc: 'Build your professional network and advance your career' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex items-start space-x-3">
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">{title}</h3>
                  <p className="text-gray-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-[#6366f1]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-[#a855f7]/10 rounded-full blur-[100px]" />
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-5">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              MentorBridge
            </Link>
          </div>

          <div className="bg-[#1a1f2e]/80 backdrop-blur-xl rounded-2xl px-7 py-5 border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-white mb-1">Sign In</h2>
              <p className="text-gray-400 text-sm">Welcome back! Please sign in to your account.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email or Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    name="usernameOrEmail"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    className="w-full bg-[#0f1419] border border-gray-600/50 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
                    placeholder="Enter your email or username"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#0f1419] border border-gray-600/50 rounded-lg pl-9 pr-10 py-2.5 text-white text-sm placeholder-gray-500 focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#6366f1] bg-[#0f1419] border-gray-600 rounded focus:ring-[#6366f1] cursor-pointer"
                  />
                  <span className="text-xs text-gray-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs text-[#6366f1] hover:text-[#7c7ff5] font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#7c7ff5] hover:from-[#5855eb] hover:to-[#6b6ae8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center space-x-2 group text-sm mt-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <p className="text-gray-400 text-xs text-center mb-2">Don't have an account?</p>
              <Link
                to="/register"
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center border border-gray-600/50 text-sm"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-3">
              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-[#1a1f2e] text-gray-500 text-xs">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="bg-[#0f1419] border border-gray-600/50 rounded-lg py-2 px-3 text-white hover:bg-gray-700/30 transition-all flex items-center justify-center space-x-2 text-sm">
                  <span>🌐</span><span>Google</span>
                </button>
                <button type="button" className="bg-[#0f1419] border border-gray-600/50 rounded-lg py-2 px-3 text-white hover:bg-gray-700/30 transition-all flex items-center justify-center space-x-2 text-sm">
                  <span>🐙</span><span>GitHub</span>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-[#6366f1] hover:underline">Terms</Link>{' '}and{' '}
            <Link to="/privacy" className="text-[#6366f1] hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
