import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, getUserAuthHeaders } from '../config/api';
import { useUserAuth } from '../context/UserAuthContext';
import { useModal } from '../context/ModalContext';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Loader from '../Components/Loader';

// ── helpers ─────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'overview', label: 'ওভারভিউ', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'submissions', label: 'সাবমিশন', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'ratings', label: 'রেটিং', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'settings', label: 'সেটিংস', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

const statusConfig = {
    approved: { text: 'অনুমোদিত', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', dot: 'bg-green-500' },
    rejected: { text: 'প্রত্যাখ্যাত', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', dot: 'bg-red-500' },
    pending: { text: 'পেন্ডিং', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', dot: 'bg-amber-500' },
};
const getStatus = (s) => statusConfig[(s || 'pending').toLowerCase()] || statusConfig.pending;

function StarRating({ value }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-4 h-4 ${star <= Math.round(value) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ))}
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className={`bg-white dark:bg-[#1f1f1f] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col gap-2 group hover:shadow-lg transition-shadow`}>
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        </div>
    );
}

// ── main component ───────────────────────────────────────────────────────────
export default function UserProfile() {
    const { user, isLoggedIn, loading: authLoading, logout, setUser } = useUserAuth();
    const { showAlert } = useModal();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Profile edit form
    const [saving, setSaving] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '' });

    // Password change form
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate('/login', { state: { from: '/profile' } });
        }
    }, [authLoading, isLoggedIn, navigate]);

    // Load profile data
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
                setUser(data.user);
            } else {
                await showAlert(data.message || 'প্রোফাইল লোড করা যায়নি।');
            }
        } catch {
            await showAlert('প্রোফাইল লোড করতে নেটওয়ার্ক সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => { loadProfile(); }, [loadProfile]);

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
                setUser(data.user);
                await showAlert('প্রোফাইল সফলভাবে আপডেট হয়েছে।');
            } else {
                await showAlert(data.message || 'আপডেট ব্যর্থ হয়েছে।');
            }
        } catch {
            await showAlert('প্রোফাইল আপডেট করতে সমস্যা হয়েছে।');
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
                setPwSuccess(data.message || 'পাসওয়ার্ড পরিবর্তন হয়েছে।');
                setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPwError(data.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
            }
        } catch {
            setPwError('নেটওয়ার্ক সমস্যা। পরে আবার চেষ্টা করুন।');
        } finally {
            setPwLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // ── Loading state ────────────────────────────────────────────────────────
    if (authLoading || (isLoggedIn && loading && !profile)) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <Loader message="প্রোফাইল লোড হচ্ছে..." />
                </div>
                <Footer />
            </div>
        );
    }

    const stats = profile?.stats || { submissions: 0, approved: 0, pending: 0, rejected: 0, ratings: 0 };
    const submissions = profile?.submissions || [];
    const ratings = profile?.ratings || [];

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#111]">
            <Header />

            <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-6 shadow-sm">
                    {/* Top gradient */}
                    <div className="h-24 bg-gradient-to-r from-[#8c0327] via-rose-600 to-orange-500 relative">
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
                            {/* Avatar */}
                            <div className="flex items-end gap-4">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8c0327] to-rose-600 border-4 border-white dark:border-[#1f1f1f] flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-3xl font-black text-white">
                                        {(user?.name || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="pb-2">
                                    <h1 className="text-xl font-black text-gray-900 dark:text-white">{user?.name || 'ব্যবহারকারী'}</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                    {user?.is_verified && (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 mt-1">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            যাচাইকৃত অ্যাকাউন্ট
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pb-2">
                                <Link
                                    to="/submit"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8c0327] hover:bg-[#7a0221] text-white text-sm font-bold transition-colors shadow-md shadow-rose-900/20"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    রেসিপি যোগ করুন
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    id="profile-logout-btn"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    লগআউট
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    <StatCard label="মোট সাবমিশন" value={stats.submissions} color="bg-blue-500" />
                    <StatCard label="অনুমোদিত" value={stats.approved} color="bg-green-500" />
                    <StatCard label="পেন্ডিং" value={stats.pending} color="bg-amber-500" />
                    <StatCard label="প্রত্যাখ্যাত" value={stats.rejected} color="bg-red-500" />
                    <StatCard label="রেটিং দিয়েছেন" value={stats.ratings} color="bg-purple-500" />
                </div>

                {/* Tabs + Content */}
                <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                    {/* Tab bar */}
                    <div className="border-b border-gray-100 dark:border-gray-800 px-6 overflow-x-auto">
                        <div className="flex gap-0 min-w-max">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    id={`tab-${tab.id}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'border-[#8c0327] text-[#8c0327] dark:text-rose-400 dark:border-rose-500'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Panels */}
                    <div className="p-6 sm:p-8">
                        {/* ── Overview Tab ── */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-black text-gray-900 dark:text-white">প্রোফাইল তথ্য সম্পাদনা</h2>
                                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1.5">নাম <span className="text-rose-500">*</span></label>
                                        <input
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none dark:text-white text-sm transition-all"
                                            required
                                            placeholder="আপনার নাম"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1.5">ইমেইল</label>
                                        <input
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#333] text-gray-500 dark:text-gray-500 text-sm cursor-not-allowed"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">ইমেইল পরিবর্তন করা যাবে না</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1.5">মোবাইল</label>
                                        <input
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none dark:text-white text-sm transition-all"
                                            placeholder="01XXXXXXXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1.5">ঠিকানা</label>
                                        <input
                                            value={profileForm.address}
                                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none dark:text-white text-sm transition-all"
                                            placeholder="শহর, জেলা"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <button
                                            type="submit"
                                            id="save-profile-btn"
                                            disabled={saving}
                                            className="px-6 py-3 bg-[#8c0327] hover:bg-[#7a0221] text-white font-bold rounded-xl disabled:opacity-70 transition-colors flex items-center gap-2 text-sm shadow-md shadow-rose-900/20"
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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    প্রোফাইল সেভ করুন
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Recent activity quick view */}
                                {submissions.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-gray-800 dark:text-gray-200">সাম্প্রতিক সাবমিশন</h3>
                                            <button onClick={() => setActiveTab('submissions')} className="text-sm text-rose-600 font-bold hover:underline">
                                                সব দেখুন →
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {submissions.slice(0, 3).map((item) => {
                                                const badge = getStatus(item.status);
                                                return (
                                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#2a2a2a]">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${badge.dot}`} />
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</span>
                                                        </div>
                                                        <span className={`ml-3 px-2.5 py-1 rounded-full text-xs font-black flex-shrink-0 ${badge.className}`}>{badge.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Submissions Tab ── */}
                        {activeTab === 'submissions' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white">
                                        আমার সাবমিশনসমূহ
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 font-semibold">{submissions.length}</span>
                                    </h2>
                                    <Link to="/submit" className="text-sm font-bold text-rose-600 hover:underline flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        নতুন
                                    </Link>
                                </div>

                                {submissions.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-semibold">এখনো কোনো রেসিপি জমা দেননি।</p>
                                        <Link to="/submit" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8c0327] text-white font-bold text-sm hover:bg-[#7a0221] transition-colors">
                                            প্রথম রেসিপি যোগ করুন
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {submissions.map((item) => {
                                            const badge = getStatus(item.status);
                                            const dateStr = item.submission_date || item.created_at;
                                            const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

                                            return (
                                                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${badge.dot}`} />
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 dark:text-white truncate">{item.title}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {item.category && (
                                                                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{item.category}</span>
                                                                )}
                                                                {formattedDate && (
                                                                    <span className="text-xs text-gray-400">{formattedDate}</span>
                                                                )}
                                                            </div>
                                                            {item.status?.toLowerCase() === 'rejected' && item.comment && (
                                                                <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-start gap-1">
                                                                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    কারণ: {item.comment}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black flex-shrink-0 ${badge.className}`}>
                                                        {badge.text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Ratings Tab ── */}
                        {activeTab === 'ratings' && (
                            <div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">
                                    আমার রেটিংসমূহ
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 font-semibold">{ratings.length}</span>
                                </h2>

                                {ratings.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-semibold">এখনো কোনো রেসিপি রেট করেননি।</p>
                                        <Link to="/" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8c0327] text-white font-bold text-sm hover:bg-[#7a0221] transition-colors">
                                            রেসিপি দেখুন
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {ratings.map((item) => {
                                            const dateStr = item.created_at;
                                            const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
                                            const isVerified = item.is_verified === true || item.is_verified === 1 || item.is_verified === '1';
                                            return (
                                                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-gray-900 dark:text-white truncate">
                                                            {item.recipe_title || `Recipe #${item.recipe_id}`}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <StarRating value={item.rating} />
                                                            <span className="text-sm font-black text-amber-500">{item.rating}/5</span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isVerified ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                                                                {isVerified ? 'যাচাইকৃত' : 'অযাচাইকৃত'}
                                                            </span>
                                                            {formattedDate && <span className="text-xs text-gray-400">{formattedDate}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Settings Tab ── */}
                        {activeTab === 'settings' && (
                            <div className="max-w-lg space-y-8">
                                {/* Change Password */}
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">পাসওয়ার্ড পরিবর্তন</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।</p>

                                    {pwError && (
                                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {pwError}
                                        </div>
                                    )}
                                    {pwSuccess && (
                                        <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                            {pwSuccess}
                                        </div>
                                    )}

                                    <form onSubmit={handleChangePassword} className="space-y-4">
                                        {[
                                            { field: 'currentPassword', label: 'বর্তমান পাসওয়ার্ড', key: 'current', placeholder: '••••••••' },
                                            { field: 'newPassword', label: 'নতুন পাসওয়ার্ড', key: 'new', placeholder: 'কমপক্ষে ৮ অক্ষর' },
                                            { field: 'confirmPassword', label: 'নতুন পাসওয়ার্ড নিশ্চিত করুন', key: 'confirm', placeholder: '••••••••' },
                                        ].map(({ field, label, key, placeholder }) => (
                                            <div key={field}>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPw[key] ? 'text' : 'password'}
                                                        value={pwForm[field]}
                                                        onChange={(e) => { setPwForm({ ...pwForm, [field]: e.target.value }); setPwError(''); setPwSuccess(''); }}
                                                        className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none dark:text-white text-sm transition-all"
                                                        placeholder={placeholder}
                                                        required
                                                        autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'}
                                                    />
                                                    <button type="button" tabIndex={-1} onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                        {showPw[key] ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="submit"
                                            id="change-password-btn"
                                            disabled={pwLoading}
                                            className="w-full py-3.5 bg-[#8c0327] hover:bg-[#7a0221] text-white font-bold rounded-xl disabled:opacity-70 transition-colors flex justify-center items-center gap-2 text-sm shadow-md shadow-rose-900/20"
                                        >
                                            {pwLoading ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    পরিবর্তন হচ্ছে...
                                                </>
                                            ) : 'পাসওয়ার্ড পরিবর্তন করুন'}
                                        </button>
                                    </form>
                                </div>

                                {/* Danger zone */}
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-base font-bold text-red-600 dark:text-red-400 mb-3">বিপদ অঞ্চল</h3>
                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        সব ডিভাইস থেকে লগআউট করুন
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
