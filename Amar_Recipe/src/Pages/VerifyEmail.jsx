import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useUserAuth } from '../context/UserAuthContext';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useUserAuth() || {};
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('আপনার ইমেইল যাচাই করা হচ্ছে...');
    const [title, setTitle] = useState('যাচাই করা হচ্ছে');
    const [verifiedUser, setVerifiedUser] = useState(null);

    const type = searchParams.get('type');
    const token = searchParams.get('token');

    useEffect(() => {
        const verify = async () => {
            if (!type || !token) {
                setStatus('error');
                setTitle('লিংকটি সঠিক নয়');
                setMessage('যাচাইকরন লিংকটি সঠিক নয়। অনুগ্রহ করে আপনার ইমেইল চেক করুন।');
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}verify_email.php?type=${type}&token=${token}`);
                
                if (response.data.success) {
                    setStatus('success');
                    setTitle('সফলভাবে যাচাই হয়েছে!');
                    setMessage(response.data.message);

                    if (response.data.token && response.data.user && login) {
                        login(response.data.user, response.data.token);
                        setVerifiedUser(response.data.user);

                        setTimeout(() => {
                            navigate('/profile', { replace: true });
                        }, 1200);
                    }
                } else {
                    setStatus('error');
                    setTitle('যাচাই করা সম্ভব হয়নি');
                    setMessage(response.data.message);
                }
            } catch (err) {
                setStatus('error');
                setTitle('কারিগরি সমস্যা');
                setMessage('একটি কারিগরি সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।');
                console.error('Verification error:', err);
            }
        };

        verify();
    }, [type, token, login, navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] font-bengali">
            <Header />
            
            <main className="flex-grow flex items-center justify-center py-16 px-4">
                <div className="max-w-md w-full bg-white dark:bg-[#1e1e1e] p-8 sm:p-10 rounded-3xl shadow-xl shadow-rose-950/5 border border-gray-100 dark:border-gray-800 text-center">
                    <div className="mb-6">
                        <span className="text-2xl font-black text-[#8c0327] dark:text-rose-400">আমার রেসিপি</span>
                    </div>

                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                        status === 'loading' ? 'bg-blue-50 text-blue-500' :
                        status === 'success' ? 'bg-green-50 text-green-500' :
                        'bg-red-50 text-red-500'
                    }`}>
                        {status === 'loading' && (
                            <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {status === 'success' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {status === 'error' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{message}</p>

                    {status === 'success' && verifiedUser ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/profile', { replace: true })}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8c0327] hover:bg-[#7a0221] text-white font-bold py-3.5 px-7 rounded-xl transition-all shadow-md shadow-rose-950/20 hover:-translate-y-0.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                আমার প্রোফাইলে যান
                            </button>
                            <Link 
                                to="/" 
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold py-3.5 px-7 rounded-xl transition-all"
                            >
                                হোমপেজে যান
                            </Link>
                        </div>
                    ) : (
                        <Link 
                            to="/" 
                            className="inline-block bg-[#8c0327] hover:bg-[#7a0221] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-rose-950/20 hover:-translate-y-0.5"
                        >
                            ওয়েবসাইটে ফিরে যান
                        </Link>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VerifyEmail;
