import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, getUserAuthHeaders } from '../config/api';
import { useUserAuth } from '../context/UserAuthContext';
import { useModal } from '../context/ModalContext';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Loader from '../Components/Loader';

const TABS = [
    {
        id: 'overview',
        label: 'ওভারভিউ',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        id: 'submissions',
        label: 'সাবমিশন',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        id: 'ratings',
        label: 'রেটিং',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
    },
    {
        id: 'settings',
        label: 'নিরাপত্তা',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
];

const statusConfig = {
    approved: {
        text: 'অনুমোদিত',
        subText: 'ওয়েবসাইটে লাইভ আছে',
        className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
    },
    rejected: {
        text: 'প্রত্যাখ্যাত',
        subText: 'ত্রুটি সংশোধন করুন',
        className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500 shadow-sm shadow-rose-500/50',
    },
    pending: {
        text: 'পেন্ডিং',
        subText: 'অ্যাডমিন রিভিউ চলছে',
        className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500 animate-pulse',
    },
};

const getStatus = (s) => statusConfig[(s || 'pending').toLowerCase()] || statusConfig.pending;

function StarRating({ value }) {
    const rounded = Math.round(Number(value) || 0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rounded ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ))}
        </div>
    );
}

export default function UserProfile() {
    const { user, isLoggedIn, loading: authLoading, logout, setUser } = useUserAuth() || {};
    const { showAlert } = useModal();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Profile form
    const [saving, setSaving] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '' });

    // Password form
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate('/login', { state: { from: '/profile' } });
        }
    }, [authLoading, isLoggedIn, navigate]);

    // Load full profile details
    const loadProfile = useCallback(async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            const res = await fetch(API_BASE_URL + 'get_user_profile.php', {
                headers: getUserAuthHeaders(),
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data);
                setProfileForm({
                    name: data.user.name || '',
                    phone: data.user.phone || '',
                    address: data.user.address || '',
                });
                if (setUser) setUser(data.user);
            } else {
                await showAlert(data.message || 'প্রোফাইল লোড করা সম্ভব হয়নি।');
            }
        } catch {
            await showAlert('প্রোফাইল লোড করতে নেটওয়ার্ক সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, setUser, showAlert]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(API_BASE_URL + 'update_user_profile.php', {
                method: 'POST',
                headers: getUserAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(profileForm),
            });
            const data = await res.json();
            if (data.success) {
                if (setUser) setUser(data.user);
                await showAlert('আপনার প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে।');
            } else {
                await showAlert(data.message || 'আপডেট করা সম্ভব হয়নি।');
            }
        } catch {
            await showAlert('প্রোফাইল আপডেট করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess('');

        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwError('নতুন পাসওয়ার্ড দুটি মিলছে না।');
            return;
        }
        if (pwForm.newPassword.length < 8) {
            setPwError('নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
            return;
        }

        setPwLoading(true);
        try {
            const res = await fetch(API_BASE_URL + 'user_change_password.php', {
                method: 'POST',
                headers: getUserAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    currentPassword: pwForm.currentPassword,
                    newPassword: pwForm.newPassword,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPwSuccess(data.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।');
                setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPwError(data.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে। বর্তমান পাসওয়ার্ড সঠিক কিনা পরীক্ষা করুন।');
            }
        } catch {
            setPwError('নেটওয়ার্ক সমস্যা। অনুগ্রহ করে পরে আবার চেষ্টা করুন।');
        } finally {
            setPwLoading(false);
        }
    };

    const handleLogout = async () => {
        if (logout) await logout();
        navigate('/');
    };

    if (authLoading || (isLoggedIn && loading && !profile)) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212]">
                <Header />
                <div className="flex-grow flex items-center justify-center p-8">
                    <Loader message="প্রোফাইল লোড হচ্ছে..." />
                </div>
                <Footer />
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    const stats = profile?.stats || { submissions: 0, approved: 0, pending: 0, rejected: 0, ratings: 0 };
    const submissions = profile?.submissions || [];
    const ratings = profile?.ratings || [];

    const getStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return { level: 1, label: 'দুর্বল', color: 'bg-red-500' };
        if (pwd.length < 8) return { level: 2, label: 'মোটামুটি', color: 'bg-amber-500' };
        if (pwd.length < 12 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { level: 3, label: 'ভালো', color: 'bg-blue-500' };
        return { level: 4, label: 'শক্তিশালী', color: 'bg-emerald-500' };
    };

    const newPwStrength = getStrength(pwForm.newPassword);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] font-bengali text-gray-800 dark:text-gray-100">
            <Header />

            <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                
                {/* ── 1. Profile Hero Card ── */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden mb-6 sm:mb-8 transition-all">
                    {/* Top Decorative Banner (Shorter and more elegant) */}
                    <div className="h-32 sm:h-40 bg-gradient-to-r from-[#8c0327] via-rose-600 to-orange-500 relative overflow-hidden flex items-end p-4 sm:p-6">
                        <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                        <div className="absolute left-1/4 bottom-0 w-48 h-48 rounded-full bg-orange-400/20 blur-2xl pointer-events-none" />
                        <div className="absolute left-1/2 top-1/2 w-32 h-32 rounded-full bg-rose-500/20 blur-xl pointer-events-none" />
                        
                        <div className="relative z-10 hidden sm:flex items-center gap-2 text-white/90 text-[11px] font-bold bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            আমার রেসিপি মেম্বার প্রোফাইল
                        </div>
                    </div>

                    {/* Profile Information Row */}
                    <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-12 sm:-mt-16">
                            
                            {/* Avatar & Details */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                                {/* Avatar with a visible ring in dark mode */}
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#8c0327] via-rose-600 to-orange-500 ring-4 ring-white dark:ring-[#2a2a2a] shadow-xl flex items-center justify-center text-white text-3xl sm:text-4xl font-black shrink-0 select-none z-10">
                                    {(user?.name || 'U').charAt(0).toUpperCase()}
                                </div>

                                <div className="space-y-1 pb-1">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                            {user?.name || 'ব্যবহারকারী'}
                                        </h1>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            যাচাইকৃত
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Header CTA Buttons */}
                            <div className="flex items-center justify-center sm:justify-start gap-3 w-full lg:w-auto pb-1">
                                <Link
                                    to="/submit"
                                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8c0327] to-rose-600 hover:from-[#7a0221] hover:to-rose-700 text-white text-sm font-bold shadow-md shadow-rose-900/20 hover:shadow-lg transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                    রেসিপি যোগ করুন
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    id="profile-logout-btn"
                                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold transition-all"
                                    title="লগআউট"
                                >
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline">লগআউট</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2. Responsive Stats Cards Row ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {/* Stat: Total Submissions */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-none">{stats.submissions}</p>
                            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">মোট সাবমিশন</p>
                        </div>
                    </div>

                    {/* Stat: Approved */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{stats.approved}</p>
                            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">অনুমোদিত</p>
                        </div>
                    </div>

                    {/* Stat: Pending */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-amber-500 leading-none">{stats.pending}</p>
                            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">পেন্ডিং</p>
                        </div>
                    </div>

                    {/* Stat: Ratings */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 leading-none">{stats.ratings}</p>
                            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">রেটিং প্রদান</p>
                        </div>
                    </div>
                </div>

                {/* ── 3. Tabs Navigation & Content Card ── */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden">
                    
                    {/* Modern Underline Tabs */}
                    <div className="border-b border-gray-100 dark:border-gray-800 px-2 sm:px-6 overflow-x-auto scrollbar-none">
                        <div className="flex items-center gap-2 sm:gap-6 min-w-max">
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const count = tab.id === 'submissions' ? submissions.length : tab.id === 'ratings' ? ratings.length : null;

                                return (
                                    <button
                                        key={tab.id}
                                        id={`tab-${tab.id}`}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 px-3 text-sm font-bold border-b-2 transition-all ${
                                            isActive
                                                ? 'border-[#8c0327] text-[#8c0327] dark:border-rose-500 dark:text-rose-400'
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                        {count !== null && count > 0 && (
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                                    isActive
                                                        ? 'bg-[#8c0327] dark:bg-rose-500/20 text-white dark:text-rose-400'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Tab Content Container ── */}
                    <div className="p-5 sm:p-8">
                        {/* ──────────────── TAB 1: OVERVIEW & PROFILE EDIT ──────────────── */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                        প্রোফাইল তথ্য
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">আপনার নাম, মোবাইল নম্বর এবং ঠিকানা হালনাগাদ করুন।</p>
                                </div>

                                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 uppercase tracking-wide">
                                            পূর্ণ নাম <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222222] focus:bg-white dark:focus:bg-[#2a2a2a] focus:ring-2 focus:ring-[#8c0327]/30 focus:border-[#8c0327] outline-none text-sm dark:text-white font-medium transition-all"
                                            placeholder="আপনার নাম"
                                            required
                                        />
                                    </div>

                                    {/* Email (Readonly) */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between uppercase tracking-wide">
                                            <span>ইমেইল ঠিকানা</span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-normal tracking-normal normal-case">
                                                <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                                পরিবর্তনযোগ্য নয়
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-500 text-sm font-medium cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Phone Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">মোবাইল নম্বর</label>
                                        <input
                                            type="text"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222222] focus:bg-white dark:focus:bg-[#2a2a2a] focus:ring-2 focus:ring-[#8c0327]/30 focus:border-[#8c0327] outline-none text-sm dark:text-white font-medium transition-all"
                                            placeholder="01XXXXXXXXX"
                                        />
                                    </div>

                                    {/* Address Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">বর্তমান ঠিকানা / শহর</label>
                                        <input
                                            type="text"
                                            value={profileForm.address}
                                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222222] focus:bg-white dark:focus:bg-[#2a2a2a] focus:ring-2 focus:ring-[#8c0327]/30 focus:border-[#8c0327] outline-none text-sm dark:text-white font-medium transition-all"
                                            placeholder="যেমন: ঢাকা, বাংলাদেশ"
                                        />
                                    </div>

                                    {/* Save Button */}
                                    <div className="md:col-span-2 flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            id="save-profile-btn"
                                            disabled={saving}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8c0327] hover:bg-[#7a0221] text-white font-bold text-sm shadow-sm transition-all disabled:opacity-70"
                                        >
                                            {saving ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    সেভ হচ্ছে...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    প্রোফাইল সেভ করুন
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Recent Activity Quick Card */}
                                {submissions.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-base">সাম্প্রতিক সাবমিশন</h3>
                                            <button
                                                onClick={() => setActiveTab('submissions')}
                                                className="text-xs font-bold text-[#8c0327] dark:text-rose-400 hover:underline flex items-center gap-1"
                                            >
                                                সবগুলো দেখুন ({submissions.length}) →
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {submissions.slice(0, 4).map((sub) => {
                                                const badge = getStatus(sub.status);
                                                return (
                                                    <div
                                                        key={sub.id}
                                                        className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#222222] flex items-center justify-between gap-3"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{sub.title}</p>
                                                            <p className="text-[11px] text-gray-500 mt-0.5">{sub.category || 'সাধারণ'}</p>
                                                        </div>
                                                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${badge.className}`}>
                                                            {badge.text}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ──────────────── TAB 2: MY SUBMISSIONS ──────────────── */}
                        {activeTab === 'submissions' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900 dark:text-white">
                                            আমার রেসিপি সাবমিশন
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">আপনার জমা দেওয়া সকল রেসিপির অনুমোদন ও পর্যালোচনা স্থিতি।</p>
                                    </div>
                                    <Link
                                        to="/submit"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#8c0327] hover:bg-[#7a0221] text-white text-xs font-bold shadow-sm transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        নতুন রেসিপি জমা দিন
                                    </Link>
                                </div>

                                {submissions.length === 0 ? (
                                    <div className="text-center py-16 px-4 bg-gray-50 dark:bg-[#222222] rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">এখনো কোনো রেসিপি জমা দেননি</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-5">
                                            আপনার প্রিয় ও স্পেশাল রান্নার রেসিপি সবার সাথে শেয়ার করুন এবং রিভিউ স্ট্যাটাস ট্র্যাক করুন।
                                        </p>
                                        <Link
                                            to="/submit"
                                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8c0327] text-white font-bold text-sm shadow-md hover:bg-[#7a0221] transition-all"
                                        >
                                            প্রথম রেসিপি যোগ করুন
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3.5">
                                        {submissions.map((item) => {
                                            const badge = getStatus(item.status);
                                            const dateStr = item.submission_date || item.created_at;
                                            const formattedDate = dateStr
                                                ? new Date(dateStr).toLocaleDateString('bn-BD', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : '';
                                            const imageUrl = `${API_BASE_URL}get_submission_image.php?id=${item.id}`;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#222222] hover:shadow-md transition-all flex flex-col gap-3"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        {/* Thumbnail + Title */}
                                                        <div className="flex items-center gap-3.5 min-w-0">
                                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.parentElement.innerHTML = `
                                                                            <div class="w-full h-full flex items-center justify-center text-gray-400">
                                                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                                                </svg>
                                                                            </div>
                                                                        `;
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{item.title}</h3>
                                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                    {item.category && (
                                                                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold">
                                                                            {item.category}
                                                                        </span>
                                                                    )}
                                                                    {formattedDate && (
                                                                        <span className="text-[11px] text-gray-400">{formattedDate}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Status Badge */}
                                                        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black ${badge.className}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                                {badge.text}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-medium sm:text-right">{badge.subText}</span>
                                                        </div>
                                                    </div>

                                                    {/* Rejection comment banner if rejected */}
                                                    {item.status?.toLowerCase() === 'rejected' && item.comment && (
                                                        <div className="mt-1 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-[11px] text-rose-800 dark:text-rose-300 flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                            <div>
                                                                <span className="font-bold">বাতিলকরণের কারণ: </span>
                                                                <span>{item.comment}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ──────────────── TAB 3: MY RATINGS ──────────────── */}
                        {activeTab === 'ratings' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white">
                                        আমার প্রদত্ত রেটিং ও রিভিউ
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">বিভিন্ন রেসিপিতে দেওয়া আপনার রেটিং ও মূল্যায়ন।</p>
                                </div>

                                {ratings.length === 0 ? (
                                    <div className="text-center py-16 px-4 bg-gray-50 dark:bg-[#222222] rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">এখনো কোনো রেসিপিতে রেটিং দেননি</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-5">
                                            রেসিপি রান্না করে উপভোগ করুন এবং অন্যান্য রাঁধুনিদের উৎসাহিত করতে আপনার মতামত দিন।
                                        </p>
                                        <Link
                                            to="/"
                                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8c0327] text-white font-bold text-sm shadow-md hover:bg-[#7a0221] transition-all"
                                        >
                                            রেসিপি দেখুন
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        {ratings.map((item) => {
                                            const formattedDate = item.created_at
                                                ? new Date(item.created_at).toLocaleDateString('bn-BD', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : '';
                                            const isVerified = item.is_verified === true || item.is_verified === 1 || item.is_verified === '1';

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#222222] hover:shadow-md transition-all flex flex-col justify-between gap-3"
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                                                                {item.recipe_title || `রেসিপি #${item.recipe_id}`}
                                                            </h3>
                                                            <span
                                                                className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                                                                    isVerified
                                                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                                                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                                                                }`}
                                                            >
                                                                {isVerified ? 'যাচাইকৃত' : 'পেন্ডিং'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2.5 mt-2">
                                                            <StarRating value={item.rating} />
                                                            <span className="text-xs font-black text-amber-500">{Number(item.rating).toFixed(1)} / 5</span>
                                                        </div>
                                                    </div>

                                                    {formattedDate && (
                                                        <p className="text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-2">
                                                            প্রদানের তারিখ: {formattedDate}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ──────────────── TAB 4: PASSWORD & SETTINGS ──────────────── */}
                        {activeTab === 'settings' && (
                            <div className="max-w-lg space-y-8">
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white">
                                        পাসওয়ার্ড পরিবর্তন
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">নিরাপত্তার জন্য পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।</p>
                                </div>

                                {pwError && (
                                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
                                        <svg className="w-5 h-5 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{pwError}</span>
                                    </div>
                                )}

                                {pwSuccess && (
                                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
                                        <svg className="w-5 h-5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{pwSuccess}</span>
                                    </div>
                                )}

                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    {/* Current Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">বর্তমান পাসওয়ার্ড</label>
                                        <div className="relative">
                                            <input
                                                type={showPw.current ? 'text' : 'password'}
                                                value={pwForm.currentPassword}
                                                onChange={(e) => {
                                                    setPwForm({ ...pwForm, currentPassword: e.target.value });
                                                    setPwError('');
                                                    setPwSuccess('');
                                                }}
                                                className="w-full px-4 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222222] focus:bg-white dark:focus:bg-[#2a2a2a] focus:ring-2 focus:ring-[#8c0327]/30 focus:border-[#8c0327] outline-none text-sm dark:text-white font-medium transition-all"
                                                placeholder="বর্তমান পাসওয়ার্ড দিন"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPw({ ...showPw, current: !showPw.current })}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showPw.current ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">নতুন পাসওয়ার্ড</label>
                                        <div className="relative">
                                            <input
                                                type={showPw.new ? 'text' : 'password'}
                                                value={pwForm.newPassword}
                                                onChange={(e) => {
                                                    setPwForm({ ...pwForm, newPassword: e.target.value });
                                                    setPwError('');
                                                    setPwSuccess('');
                                                }}
                                                className="w-full px-4 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222222] focus:bg-white dark:focus:bg-[#2a2a2a] focus:ring-2 focus:ring-[#8c0327]/30 focus:border-[#8c0327] outline-none text-sm dark:text-white font-medium transition-all"
                                                placeholder="কমপক্ষে ৮ অক্ষর"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPw({ ...showPw, new: !showPw.new })}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showPw.new ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                )}
                                            </button>
                                        </div>

                                        {/* Password Strength indicator */}
                                        {newPwStrength && (
                                            <div className="pt-1.5 flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex gap-1">
                                                    {[1, 2, 3, 4].map((step) => (
                                                        <div
                                                            key={step}
                                                            className={`flex-1 h-full rounded-full transition-all ${
                                                                step <= newPwStrength.level ? newPwStrength.color : 'bg-transparent'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500">{newPwStrength.label}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                                        <div className="relative">
                                            <input
                                                type={showPw.confirm ? 'text' : 'password'}
                                                value={pwForm.confirmPassword}
                                                onChange={(e) => {
                                                    setPwForm({ ...pwForm, confirmPassword: e.target.value });
                                                    setPwError('');
                                                    setPwSuccess('');
                                                }}
                                                className="w-full px-4 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222222] focus:bg-white dark:focus:bg-[#2a2a2a] focus:ring-2 focus:ring-[#8c0327]/30 focus:border-[#8c0327] outline-none text-sm dark:text-white font-medium transition-all"
                                                placeholder="পুনরায় পাসওয়ার্ড দিন"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showPw.confirm ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        id="change-password-btn"
                                        disabled={pwLoading}
                                        className="w-full py-3 bg-[#8c0327] hover:bg-[#7a0221] text-white font-bold rounded-xl disabled:opacity-70 transition-all flex justify-center items-center gap-2 text-sm shadow-sm"
                                    >
                                        {pwLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                পরিবর্তন হচ্ছে...
                                            </>
                                        ) : (
                                            'পাসওয়ার্ড আপডেট করুন'
                                        )}
                                    </button>
                                </form>

                                {/* Danger Zone Card */}
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">সেশন ও লগআউট</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">এই ডিভাইস থেকে আপনার সেশন সমাপ্ত করতে নিচে ক্লিক করুন।</p>
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        লগআউট করুন
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}