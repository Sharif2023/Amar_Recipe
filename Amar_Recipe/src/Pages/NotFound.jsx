import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-black text-rose-500 dark:text-rose-600 mb-4 tracking-tighter animate-bounce">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                    দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন তা সম্ভবত মুছে ফেলা হয়েছে বা লিংকটি ভুল।
                </p>
                <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-rose-600 border border-transparent rounded-full shadow-lg hover:bg-rose-700 hover:shadow-rose-600/30 hover:-translate-y-1">
                    মূল পাতায় ফিরে যান
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
