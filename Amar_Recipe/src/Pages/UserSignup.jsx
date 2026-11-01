import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function UserSignup() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('পাসওয়ার্ড দুটি মিলছে না।');
            return;
        }
        if (formData.password.length < 8) {
            setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(API_BASE_URL + 'user_signup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'সাইনআপ সম্পন্ন হয়নি।');
            }
        } catch {
            setError('নেটওয়ার্ক সমস্যা। পরে আবার চেষ্টা করুন।');
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return { level: 1, label: 'দুর্বল', color: 'bg-red-500' };
        if (pwd.length < 8) return { level: 2, label: 'মোটামুটি', color: 'bg-amber-500' };
        if (pwd.length < 12 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { level: 3, label: 'ভালো', color: 'bg-blue-500' };
        return { level: 4, label: 'শক্তিশালী', color: 'bg-green-500' };
    };

    const strength = getPasswordStrength(formData.password);

    if (success) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50/60 to-orange-50/60 dark:from-[#1a1a1a] dark:to-[#111]">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4 py-10">
                    <div className="w-full max-w-sm text-center">
                        <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden p-6">
                            <div className="h-1 w-full bg-gradient-to-r from-green-400 to-emerald-500 -mx-6 mb-6" style={{ marginLeft: '-1.5rem', width: 'calc(100% + 3rem)' }} />
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 mb-4">
                                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">ইমেইল যাচাই করুন!</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-1 text-xs leading-relaxed">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{formData.email}</span> ঠিকানায় একটি যাচাইকরণ ইমেইল পাঠানো হয়েছে।
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mb-5 text-xs">
                                ইমেইলের লিংকে ক্লিক করে অ্যাকাউন্ট সক্রিয় করুন।
                            </p>
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 mb-4 text-left">
                                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                                    💡 ইনবক্সে না পেলে স্প্যাম ফোল্ডার চেক করুন।
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-gradient-to-r from-[#8c0327] to-rose-600 text-white font-bold rounded-lg shadow-md shadow-rose-600/25 hover:from-[#7a0221] hover:to-rose-700 transition-all text-xs"
                            >
                                লগইন পেইজে যান
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50/60 to-orange-50/60 dark:from-[#1a1a1a] dark:to-[#111]">
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 py-10">
                {/* Increased overall max width to 6xl for larger screens */}
                <div className="w-full max-w-6xl">
                    {/* Professional 12-column grid with a 7/5 split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        {/* LEFT: GIF illustration (Expands to fill 7 columns naturally) */}
                        <div className="hidden lg:flex lg:col-span-7 items-center justify-center w-full">
                            <img
                                src="https://i.pinimg.com/originals/93/5e/f3/935ef3e9c164fe37ddde01ccd8cec4ba.gif"
                                alt="Signup illustration"
                                className="w-full h-auto max-w-2xl object-contain drop-shadow-xl"
                                loading="lazy"
                            />
                        </div>

                        {/* RIGHT: Form container (Takes 5 columns) */}
                        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto lg:col-span-5">
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="h-1 w-full bg-gradient-to-r from-[#8c0327] via-rose-500 to-orange-500" />

                                <div className="px-5 py-6">
                                    {/* Header */}
                                    <div className="text-center mb-5">
                                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-900/20 mb-2.5">
                                            <svg className="w-5 h-5 text-[#8c0327] dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                        </div>
                                        <h1 className="text-xl font-black text-gray-900 dark:text-white">অ্যাকাউন্ট তৈরি করুন</h1>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            সাবমিশন ও রেটিং ট্র্যাক করতে সাইনআপ করুন
                                        </p>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>
                                        </div>
                                    )}

                                    {/* Guest notice */}
                                    <div className="mb-4 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
                                        <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                                            ℹ️ অ্যাকাউন্ট ছাড়াও রেসিপি সাবমিট করা যাবে, তবে ট্র্যাক করতে লগইন প্রয়োজন।
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                                                নাম <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all dark:text-white text-xs"
                                                placeholder="আপনার পূর্ণ নাম"
                                                autoComplete="name"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" htmlFor="reg-email">
                                                ইমেইল <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="reg-email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all dark:text-white text-xs"
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                            />
                                        </div>

                                        {/* Phone & Address */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" htmlFor="phone">
                                                    মোবাইল <span className="text-gray-400 font-normal text-[10px]">(ঐচ্ছিক)</span>
                                                </label>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    type="text"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all dark:text-white text-xs"
                                                    placeholder="01XXXXXXXXX"
                                                    autoComplete="tel"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" htmlFor="address">
                                                    ঠিকানা <span className="text-gray-400 font-normal text-[10px]">(ঐচ্ছিক)</span>
                                                </label>
                                                <input
                                                    id="address"
                                                    name="address"
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all dark:text-white text-xs"
                                                    placeholder="শহর, জেলা"
                                                    autoComplete="address-level2"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" htmlFor="reg-password">
                                                পাসওয়ার্ড <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="reg-password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all dark:text-white text-xs"
                                                    placeholder="কমপক্ষে ৮ অক্ষর"
                                                    autoComplete="new-password"
                                                />
                                                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                    {showPassword ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                            {strength && (
                                                <div className="mt-1.5 flex items-center gap-2">
                                                    <div className="flex gap-1 flex-1">
                                                        {[1, 2, 3, 4].map((i) => (
                                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                                                        ))}
                                                    </div>
                                                    <span className={`text-[10px] font-semibold ${strength.level === 1 ? 'text-red-500' : strength.level === 2 ? 'text-amber-500' : strength.level === 3 ? 'text-blue-500' : 'text-green-500'}`}>
                                                        {strength.label}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirm-password">
                                                পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="confirm-password"
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className={`w-full pl-3 pr-10 py-2 rounded-lg border bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 outline-none transition-all dark:text-white text-xs ${
                                                        formData.confirmPassword && formData.password !== formData.confirmPassword
                                                            ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                                                            : formData.confirmPassword && formData.password === formData.confirmPassword
                                                            ? 'border-green-400 focus:ring-green-500/30 focus:border-green-500'
                                                            : 'border-gray-200 dark:border-gray-700 focus:ring-rose-500/30 focus:border-rose-500'
                                                    }`}
                                                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                                                    autoComplete="new-password"
                                                />
                                                <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                    {showConfirmPassword ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                                <p className="mt-1 text-[10px] text-red-500 font-medium">পাসওয়ার্ড দুটি মিলছে না।</p>
                                            )}
                                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                                <p className="mt-1 text-[10px] text-green-500 font-medium flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                    পাসওয়ার্ড মিলেছে
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            id="signup-submit-btn"
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
                                            ) : 'অ্যাকাউন্ট তৈরি করুন'}
                                        </button>

                                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
                                            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                                            <Link to="/login" className="text-rose-600 font-bold hover:underline">
                                                লগইন করুন
                                            </Link>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}