import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('আপনার ইমেইল যাচাই করা হচ্ছে...');
    const [title, setTitle] = useState('যাচাই করা হচ্ছে');

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
                // Determine API URL based on environment or global config if available
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amar-recipe-backend.onrender.com/src/api/';
                const response = await axios.get(`${API_URL}verify_email.php?type=${type}&token=${token}`);
                
                if (response.data.success) {
                    setStatus('success');
                    setTitle('সফলভাবে যাচাই হয়েছে!');
                    setMessage(response.data.message);
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
    }, [type, token]);

    return (
        <div className="flex flex-col min-height-screen bg-gray-50">
            <Header />
            
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <div className="mb-8">
                        <span className="text-2xl font-extrabold text-[#e11d48]">Amar Recipe</span>
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

                    <h1 className="text-2xl font-bold text-gray-800 mb-3">{title}</h1>
                    <p className="text-gray-600 leading-relaxed mb-10">{message}</p>

                    <Link 
                        to="/" 
                        className="inline-block bg-[#e11d48] hover:bg-[#be123c] text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-md shadow-red-100 hover:-translate-y-0.5"
                    >
                        ওয়েবসাইটে ফিরে যান
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VerifyEmail;
