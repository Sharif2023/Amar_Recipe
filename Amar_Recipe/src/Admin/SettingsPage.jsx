import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const SettingsPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('password'); // Default section is password

    const navigate = useNavigate();

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);
        const admin = JSON.parse(localStorage.getItem("admin"));  // Get the logged-in admin's info
        const email = admin.email;  // Extract email from the logged-in admin

        try {
            const response = await fetch(getApiUrl(API_CONFIG.ADMIN.CHANGE_PASSWORD), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, email }) // Include email here
            });

            const result = await response.json();
            if (result.success) {
                alert('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
                navigate('/adminpanel');
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('কোনও সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    const handleAccountDelete = async () => {
        const confirmation = window.confirm('আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্টটি মুছে ফেলতে চান? এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।');
        if (confirmation) {
            setLoading(true);
            const admin = JSON.parse(localStorage.getItem("admin"));  // Get the logged-in admin's info
            const email = admin.email;  // Extract email from the logged-in admin

            try {
                const response = await fetch(getApiUrl(API_CONFIG.ADMIN.DELETE_ACCOUNT), {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }) // Include email here
                });

                const result = await response.json();
                if (result.success) {
                    alert('অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে!');
                    navigate('/adminlogin');
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError('কোনও সমস্যা হয়েছে।');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-1/5 bg-gray-800 text-white h-screen p-6">
                <h2 className="text-2xl font-semibold mb-8">সেটিংস</h2>
                <ul className="space-y-6">
                    <li>
                        <button
                            onClick={() => setActiveSection('password')}
                            className={`w-full text-left py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600 flex items-center space-x-3 ${activeSection === 'password' ? 'bg-gray-700 text-red-400' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                            </svg>
                            <span>পাসওয়ার্ড পরিবর্তন</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveSection('delete')}
                            className={`w-full text-left py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600 flex items-center space-x-3 ${activeSection === 'delete' ? 'bg-gray-700 text-red-400' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            <span>একাউন্ট মুছুন</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6 flex-grow flex flex-col bg-[#f8f8ff]">
                <h2 className="text-3xl font-semibold mb-6">সেটিংস এবং প্রাইভেসি</h2>

                {/* Change Password Section */}
                {activeSection === 'password' && (
                    <div id="password" className="mb-12">
                        <h3 className="text-xl font-medium text-gray-700 mb-4">পাসওয়ার্ড পরিবর্তন</h3>
                        <form onSubmit={e => e.preventDefault()} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">বর্তমান পাসওয়ার্ড</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">নতুন পাসওয়ার্ড</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">পুনরায় নতুন পাসওয়ার্ড</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                                />
                            </div>
                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            <button
                                onClick={handlePasswordChange}
                                disabled={loading}
                                className="w-full mt-4 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition duration-300"
                            >
                                {loading ? 'পাসওয়ার্ড পরিবর্তিত হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Delete Account Section */}
                {activeSection === 'delete' && (
                    <div id="delete" className="mb-12 flex-grow">
                        <h3 className="text-xl font-medium text-gray-700 mb-4">একাউন্ট মুছুন</h3>
                        <p className="text-sm text-gray-600 mb-4">
                        আপনার অ্যাকাউন্ট মুছে ফেললে আপনার সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে। এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।
                        </p>
                        <button
                            onClick={handleAccountDelete}
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300"
                        >
                            {loading ? 'মুছা হচ্ছে...' : 'অ্যাকাউন্ট মুছে ফেলুন'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
