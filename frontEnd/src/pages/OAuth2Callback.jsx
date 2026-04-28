import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            setError('OAuth2 login failed: ' + errorParam);
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (token) {
            // Store the token and fetch user profile
            localStorage.setItem('token', token);
            // Force a page reload to let AuthContext pick up the token
            window.location.href = '/dashboard';
        } else {
            setError('No authentication token received.');
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#060e1d] flex items-center justify-center">
            <div className="text-center">
                {error ? (
                    <div className="space-y-4">
                        <span className="material-symbols-outlined text-error text-5xl">error</span>
                        <p className="text-error text-lg font-bold">{error}</p>
                        <p className="text-[#9baad6] text-sm">Redirecting to login...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                        <div>
                            <p className="text-[#dee5ff] text-xl font-black tracking-tight">Securing Your Session</p>
                            <p className="text-[#9baad6] text-sm mt-2">Establishing encrypted connection to the Nexus...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OAuth2Callback;
