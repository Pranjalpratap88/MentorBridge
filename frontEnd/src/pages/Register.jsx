import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
    userRole: '', college: '', graduationYear: '', currentCompany: '',
    currentPosition: '', workExperience: '',
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.username.trim() || formData.username.length < 3) return 'Username must be at least 3 characters';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email is required';
    if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password))
      return 'Password must contain uppercase, lowercase, number, and special character';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.userRole) return 'Please select your role';
    const role = formData.userRole;
    if (['STUDENT', 'SENIOR_STUDENT', 'ALUMNI'].includes(role)) {
      if (!formData.college.trim()) return 'College name is required';
      if (!formData.graduationYear) return 'Graduation year is required';
      const gradYear = parseInt(formData.graduationYear);
      if (role === 'STUDENT' && gradYear <= currentYear) return 'Students must have a future graduation year';
      if (role === 'SENIOR_STUDENT' && ![currentYear, currentYear + 1].includes(gradYear))
        return 'Senior students must be graduating this year or next year';
      if (role === 'ALUMNI' && gradYear >= currentYear) return 'Alumni must have graduated in the past';
    }
    if (['ALUMNI', 'MENTOR'].includes(role)) {
      if (!formData.currentCompany.trim()) return 'Current company is required';
      if (!formData.currentPosition.trim()) return 'Current position is required';
      if (role === 'MENTOR') {
        if (!formData.workExperience) return 'Work experience is required';
        if (parseInt(formData.workExperience) < 2) return 'Mentors must have at least 2 years of experience';
      }
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', formData);
      setSuccess('Registration successful! Please check your email for the verification code.');
      setShowOtpVerification(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setError('Please enter a valid 6-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/verify-email', { email: formData.email, otp });
      setSuccess('Email verified! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post(`/auth/resend-verification?email=${formData.email}`);
      setSuccess('New verification code sent to your email');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const inputCls = "w-full bg-[#0f1419] border border-gray-600/50 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-300 mb-1.5";

  // ── OTP Screen ──────────────────────────────────────────────────────────────
  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1a1f2e]/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-gray-700/50 shadow-2xl"
        >
          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-[#6366f1]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-[#6366f1]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Verify Your Email</h2>
            <p className="text-gray-400 text-xs">
              We sent a 6-digit code to{' '}
              <span className="text-[#6366f1] font-medium">{formData.email}</span>
            </p>
          </div>

          {error && <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">{error}</div>}
          {success && <div className="mb-3 p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs text-center">{success}</div>}

          <form onSubmit={handleOtpVerification} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-[#0f1419] border border-gray-600/50 rounded-lg px-4 py-3 text-white text-center text-xl tracking-widest font-mono focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20"
              placeholder="000000"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#7c7ff5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all text-sm"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Didn't receive the code?</p>
              <button type="button" onClick={resendOtp} className="text-[#6366f1] text-xs font-semibold hover:underline">
                Resend Code
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Main Register Form ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f2e] to-[#0f1419] flex flex-col lg:flex-row">

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20" />
        <div className="relative z-10 flex flex-col justify-center px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8">
            <h1 className="text-3xl xl:text-4xl font-black text-white mb-3 leading-tight">
              Join{' '}
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
              { color: 'text-[#6366f1]', bg: 'bg-[#6366f1]/20', title: 'Expert Mentorship', desc: 'Get guidance from industry professionals and alumni' },
              { color: 'text-[#10b981]', bg: 'bg-[#10b981]/20', title: 'Knowledge Sharing', desc: 'Ask questions and share your expertise with the community' },
              { color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/20', title: 'Career Growth', desc: 'Build your professional network and advance your career' },
            ].map(({ color, bg, title, desc }) => (
              <div key={title} className="flex items-start space-x-3">
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <CheckCircle className={`w-4 h-4 ${color}`} />
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-3"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-4">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              MentorBridge
            </Link>
          </div>

          <div className="bg-[#1a1f2e]/80 backdrop-blur-xl rounded-2xl px-7 py-5 border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
              <p className="text-gray-400 text-xs">
                Step {step} of 2 — {step === 1 ? 'Basic Information' : 'Role Details'}
              </p>
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`h-1 w-16 rounded-full transition-all ${step >= 1 ? 'bg-[#6366f1]' : 'bg-gray-600'}`} />
                <div className={`h-1 w-16 rounded-full transition-all ${step >= 2 ? 'bg-[#6366f1]' : 'bg-gray-600'}`} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </motion.div>
            )}

            {/* ── Step 1 ── */}
            {step === 1 && (
              <form className="space-y-2.5">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                      className={`${inputCls} pl-9`} placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input type="text" name="username" value={formData.username} onChange={handleChange}
                      className={`${inputCls} pl-9`} placeholder="johndoe" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={`${inputCls} pl-9`} placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                      className={`${inputCls} pl-9 pr-9`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                      className={`${inputCls} pl-9 pr-9`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Uppercase, lowercase, number, and special character required</p>
                </div>
                <button type="button" onClick={handleNext}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#7c7ff5] text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 text-sm">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div>
                  <label className={labelCls}>Select Your Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'STUDENT', label: 'Student' },
                      { value: 'SENIOR_STUDENT', label: 'Senior Student' },
                      { value: 'ALUMNI', label: 'Alumni' },
                      { value: 'MENTOR', label: 'Mentor' },
                    ].map((role) => (
                      <label key={role.value}
                        className={`p-2.5 border rounded-lg cursor-pointer transition-all text-center text-xs font-medium ${
                          formData.userRole === role.value
                            ? 'border-[#6366f1] bg-[#6366f1]/10 text-white'
                            : 'border-gray-600/50 text-gray-300 hover:border-gray-500'
                        }`}>
                        <input type="radio" name="userRole" value={role.value}
                          checked={formData.userRole === role.value} onChange={handleChange} className="sr-only" />
                        {role.label}
                      </label>
                    ))}
                  </div>
                </div>

                {['STUDENT', 'SENIOR_STUDENT', 'ALUMNI'].includes(formData.userRole) && (
                  <>
                    <div>
                      <label className={labelCls}>College/University</label>
                      <input type="text" name="college" value={formData.college} onChange={handleChange}
                        className={inputCls} placeholder="University Name" />
                    </div>
                    <div>
                      <label className={labelCls}>Graduation Year</label>
                      <select name="graduationYear" value={formData.graduationYear} onChange={handleChange} className={inputCls}>
                        <option value="">Select Year</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {['ALUMNI', 'MENTOR'].includes(formData.userRole) && (
                  <>
                    <div>
                      <label className={labelCls}>Current Company</label>
                      <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange}
                        className={inputCls} placeholder="Company Name" />
                    </div>
                    <div>
                      <label className={labelCls}>Current Position</label>
                      <input type="text" name="currentPosition" value={formData.currentPosition} onChange={handleChange}
                        className={inputCls} placeholder="Job Title" />
                    </div>
                  </>
                )}

                {formData.userRole === 'MENTOR' && (
                  <div>
                    <label className={labelCls}>Work Experience (years)</label>
                    <input type="number" name="workExperience" value={formData.workExperience} onChange={handleChange}
                      min="0" className={inputCls} placeholder="e.g. 5" />
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 border border-gray-600/50 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#7c7ff5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all text-sm">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-gray-700/50 text-center">
              <p className="text-gray-400 text-xs mb-2">Already have an account?</p>
              <Link to="/login"
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center border border-gray-600/50 text-sm">
                Sign In
              </Link>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-[#6366f1] hover:underline">Terms</Link>{' '}and{' '}
            <Link to="/privacy" className="text-[#6366f1] hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
