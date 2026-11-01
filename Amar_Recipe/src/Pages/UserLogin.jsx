import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useUserAuth } from '../context/UserAuthContext';
import { useModal } from '../context/ModalContext';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationNeeded, setVerificationNeeded] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUserAuth();
    const { showAlert } = useModal();

    // Redirect to intended page after login, or profile
    const from = location.state?.from || '/profile';

    const handleLogIn = async (e) => {
        e.preventDefault();
        setError('');
        setVerificationNeeded(false);
        setIsLoading(true);

        try {
            const res = await fetch(API_BASE_URL + 'user_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success && data.token && data.user) {
                login(data.user, data.token);
                navigate(from, { replace: true });
            } else if (data.verification_required) {
                setVerificationNeeded(true);
                setError('আপনার ইমেইল যাচাই করুন। ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।');
            } else {
                setError(data.message || 'লগইন ব্যর্থ হয়েছে।');
            }
        } catch {
            setError('লগইন করার সময় নেটওয়ার্কে সমস্যা হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50/60 to-orange-50/60 dark:from-[#1a1a1a] dark:to-[#111]">
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 py-10">
                {/* Increased overall max width to match signup */}
                <div className="w-full max-w-6xl">
                    {/* 12-column grid with a 7/5 split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        {/* LEFT: GIF illustration (Size constrained) */}
                        <div className="hidden lg:flex lg:col-span-7 items-center justify-center w-full">
                            <img
                                src="https://media.baamboozle.com/uploads/images/1100830/1682114735_89642_gif-url.gif"
                                alt="Login illustration"
                                className="w-full h-auto max-w-sm lg:max-w-md max-h-[380px] object-contain drop-shadow-xl mx-auto"
                                loading="lazy"
                            />
                        </div>

                        {/* RIGHT: Form container */}
                        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto lg:col-span-5">
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                {/* Top gradient strip */}
                                <div className="h-1 w-full bg-gradient-to-r from-[#8c0327] via-rose-500 to-orange-500" />

                                <div className="px-5 py-6">
                                    {/* Header */}
                                    <div className="text-center mb-5">
                                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-900/20 mb-2.5">
                                            <svg className="w-5 h-5 text-[#8c0327] dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h1 className="text-xl font-black text-gray-900 dark:text-white">লগইন</h1>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            আপনার অ্যাকাউন্টে প্রবেশ করুন
                                        </p>
                                    </div>

                                    {/* Error Banner */}
                                    {error && (
                                        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-start gap-2">
                                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>
                                                {verificationNeeded && (
                                                    <Link to="/verify-email" className="mt-1 text-[10px] text-red-600 dark:text-red-400 underline">
                                                        পুনরায় যাচাইয়ের ইমেইল পাঠান
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Form */}
                                    <form onSubmit={handleLogIn} className="space-y-3">
                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                                                ইমেইল <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all dark:text-white text-xs"
                                                    placeholder="you@example.com"
                                                    required
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300" htmlFor="password">
                                                    পাসওয়ার্ড <span className="text-rose-500">*</span>
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all dark:text-white text-xs"
                                                    placeholder="••••••••"
                                                    required
                                                    autoComplete="current-password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            id="login-submit-btn"
                                            disabled={isLoading}
                                            className="w-full mt-1 py-2.5 px-4 bg-gradient-to-r from-[#8c0327] to-rose-600 hover:from-[#7a0221] hover:to-rose-700 text-white font-bold rounded-lg transition-all shadow-md shadow-rose-600/25 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs tracking-wide"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    প্রসেসিং...
                                                </>
                                            ) : 'লগইন করুন'}
                                        </button>

                                        {/* Divider */}
                                        <div className="relative my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                                            </div>
                                            <div className="relative flex justify-center text-[10px]">
                                                <span className="px-3 bg-white dark:bg-[#1f1f1f] text-gray-400">অথবা</span>
                                            </div>
                                        </div>

                                        {/* Sign up link */}
                                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
                                            অ্যাকাউন্ট নেই?{' '}
                                            <Link to="/signup" className="text-rose-600 font-bold hover:underline">
                                                সাইনআপ করুন
                                            </Link>
                                        </p>
                                    </form>
                                </div>
                            </div>

                            {/* Info note */}
                            <p className="mt-4 text-center text-[10px] text-gray-400 dark:text-gray-600">
                                লগইন ছাড়াও রেসিপি সাবমিট করা যায়, তবে ট্র্যাকিং করতে অ্যাকাউন্ট প্রয়োজন।
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}