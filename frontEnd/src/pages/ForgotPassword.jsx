import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Please enter a valid email address'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email: formData.email });
      setSuccess('Password reset code sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) { setError('Please enter a valid 6-digit code'); return; }
    setStep(3); setError(''); setSuccess('Code verified! Please set your new password.');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || formData.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
      setError('Password must contain uppercase, lowercase, number, and special character'); return;
    }
    if (formData.newPassword !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', { email: formData.email, otp: formData.otp, newPassword: formData.newPassword });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally { setLoading(false); }
  };

  const resendOtp = async () => {
    try {
      await api.post(`/auth/resend-otp?email=${formData.email}&type=password_reset`);
      setSuccess('New reset code sent to your email');
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    }
  };

  const inputCls = "w-full bg-[#0f1419] border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-400 focus:border-[#6366f1] focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1f2e] rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-3 block">
            MentorBridge
          </Link>
          <h2 className="text-xl font-bold text-white mb-1">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify Code'}
            {step === 3 && 'New Password'}
          </h2>
          <p className="text-gray-400 text-xs">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Enter the 6-digit code sent to your email'}
            {step === 3 && 'Create a new secure password'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-5">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? 'bg-[#6366f1] text-white' : 'bg-gray-700 text-gray-400'
                }`}>{s}</div>
                {i < 2 && <div className={`w-10 h-0.5 transition-all ${step > s ? 'bg-[#6366f1]' : 'bg-gray-700'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-xs">{success}</p>
          </motion.div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`${inputCls} pl-9`} placeholder="Enter your email address" autoComplete="email" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#6366f1] hover:bg-[#5855eb] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 group text-sm">
              <span>{loading ? 'Sending...' : 'Send Reset Code'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Verification Code</label>
              <input type="text" name="otp" value={formData.otp}
                onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                className="w-full bg-[#0f1419] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-center text-xl tracking-widest font-mono focus:border-[#6366f1] focus:outline-none"
                placeholder="000000" maxLength={6} />
              <p className="text-xs text-gray-400 mt-1 text-center">Code sent to {formData.email}</p>
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm">
                <ArrowLeft className="w-4 h-4" /><span>Back</span>
              </button>
              <button type="submit" disabled={formData.otp.length !== 6}
                className="flex-1 bg-[#6366f1] hover:bg-[#5855eb] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                Verify Code
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Didn't receive the code?</p>
              <button type="button" onClick={resendOtp} className="text-[#6366f1] hover:underline text-xs font-medium">
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleChange}
                  className={`${inputCls} pl-9 pr-9`} placeholder="Enter new password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  className={`${inputCls} pl-9 pr-9`} placeholder="Confirm new password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Uppercase, lowercase, number, and special character required</p>
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm">
                <ArrowLeft className="w-4 h-4" /><span>Back</span>
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#6366f1] hover:bg-[#5855eb] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm">
                <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                {!loading && <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-5 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-xs">
            Remember your password?{' '}
            <Link to="/login" className="text-[#6366f1] hover:underline font-medium">Sign in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
