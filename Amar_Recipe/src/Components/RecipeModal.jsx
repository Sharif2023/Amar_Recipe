import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import {
    IoClose,
    IoStar,
    IoLocationOutline,
    IoFolderOpenOutline,
    IoPersonOutline,
    IoLinkOutline,
    IoPlayCircleOutline,
    IoAlertCircleOutline,
    IoCheckmarkCircle,
    IoSend
} from 'react-icons/io5';

const backendBaseUrl = API_BASE_URL;

const categoryBanglaMap = {
    Meat: 'মাংস',
    Fish: 'মাছ',
    Egg: 'ডিম',
    dairy: 'দুগ্ধজাত',
    VegetablewithMeatorFish: 'শাকসবজি দিয়ে মাছ/মাংস/অন্যান্য',
    Vegetables: 'শাকসবজি',
    Bharta: 'ভর্তা',
    Salad: 'সালাদ',
    achar: 'আচার',
    Soup: 'স্যুপ',
    Drinks: 'পানীয়',
    Desserts: 'ডেজার্ট, মিষ্টান্ন',
    Rice_and_Pasta: 'রাইস আইটেম',
    Snacks: 'হালকা খাবার/ ফাস্টফুড',
    SaucesAndCondiments: 'সস/মশলা',
    Bangladeshi: 'বাঙ্গালী',
    Chinese: 'চাইনিজ্জ',
    Italian: 'ইতালীয়ান',
};

const reportReasons = [
    { id: 'duplicate', label: 'ডুপলিকেট রেসিপি' },
    { id: 'wrong', label: 'ভুল রেসিপি' },
    { id: 'offensive', label: 'অশ্লীল/অপমানজনক' },
    { id: 'spam', label: 'স্প্যাম' },
];

const RecipeModal = ({ isOpen, onClose, recipe }) => {
    if (!isOpen || !recipe) return null;

    const [reportOpen, setReportOpen] = useState(false);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [otherReason, setOtherReason] = useState('');
    const [submitStatus, setSubmitStatus] = useState(null);
    const [rating, setRating] = useState(0);
    const [email, setEmail] = useState('');
    const [averageRating, setAverageRating] = useState(recipe.average_rating || 0);
    const [ratingCount, setRatingCount] = useState(recipe.ratingcount || 0);

    const toggleReason = (id) => {
        setSelectedReasons((prev) =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const handleReportSubmit = async () => {
        if (selectedReasons.length === 0 && otherReason.trim() === '') {
            alert('কমপক্ষে একটি কারণ নির্বাচন করুন বা অন্যান্য কারণ লিখুন।');
            return;
        }

        const reportData = {
            recipeId: recipe.id,
            reasons: selectedReasons,
            otherReason: otherReason.trim(),
            reportedAt: new Date().toISOString(),
            reporterEmail: recipe.organizeremail
        };

        try {
            const res = await fetch(API_BASE_URL + 'report_recipe.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });
            const json = await res.json();

            if (json.success) {
                setSubmitStatus('success');
                setSelectedReasons([]);
                setOtherReason('');
                setTimeout(() => {
                    setReportOpen(false);
                    setSubmitStatus(null);
                }, 2000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        }
    };

    const handleSubmitRating = async () => {
        if (!email || rating === 0) {
            alert('দয়া করে আপনার ইমেইল এবং রেটিং প্রদান করুন');
            return;
        }

        const checkRating = await fetch(API_BASE_URL + 'check_user_rating.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipeId: recipe.id, email: email }),
        });

        const checkData = await checkRating.json();

        if (checkData.success && checkData.exists) {
            alert('আপনি ইতিমধ্যে এই রেসিপিটিকে রেটিং দিয়েছেন!');
            return;
        }

        const ratingData = {
            recipeId: recipe.id,
            email,
            rating,
        };

        try {
            const res = await fetch(API_BASE_URL + 'rate_recipe.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ratingData),
            });
            const json = await res.json();

            if (json.success) {
                const newTotalRatings = Number(ratingCount) * Number(averageRating) + Number(rating);
                const newCount = Number(ratingCount) + 1;
                setAverageRating((newTotalRatings / newCount).toFixed(1));
                setRatingCount(newCount);
                alert('আপনার রেটিং সফলভাবে জমা হয়েছে!');
            } else {
                alert(json.message || 'রেটিং জমা দিতে ব্যর্থ হয়েছে');
            }
        } catch (error) {
            alert('রেটিং জমা দিতে সমস্যা হয়েছে');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
            <div className="bg-white dark:bg-[#121212] w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-reveal relative">

                {/* Close Button - Floating on Desktop, Bar on Mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full text-gray-800 dark:text-white hover:bg-rose-500 hover:text-white transition-all shadow-lg hidden sm:block"
                >
                    <IoClose size={24} />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* Left Side: Visuals & Metadata */}
                        <div className="bg-gray-50 dark:bg-[#1b1b1b] p-0 lg:p-8 flex flex-col">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-4 lg:hidden bg-white dark:bg-[#121212] border-b dark:border-gray-800 sticky top-0 z-40">
                                <h2 className="text-xl font-bold dark:text-white truncate pr-4">{recipe.title}</h2>
                                <button onClick={onClose} className="text-gray-500">
                                    <IoClose size={24} />
                                </button>
                            </div>

                            <div className="relative group">
                                <img
                                    src={recipe.image_url
                                        ? (recipe.image_url.startsWith('http') ? recipe.image_url : backendBaseUrl + recipe.image_url)
                                        : 'https://via.placeholder.com/600x400?text=Premium+Recipe'}
                                    alt={recipe.title}
                                    className="w-full aspect-[4/3] object-cover sm:rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 shadow-sm uppercase tracking-wider">
                                        <IoFolderOpenOutline />
                                        {categoryBanglaMap[recipe.category] || recipe.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 lg:p-0 mt-6 space-y-4">
                                <h2 className="hidden lg:block text-3xl font-black dark:text-white leading-tight mb-4">{recipe.title}</h2>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-[#262525] p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                                        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg">
                                            <IoLocationOutline size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest">উৎপত্তিস্থল</p>
                                            <p className="text-sm font-bold dark:text-gray-200">{recipe.location}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#262525] p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                                        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg">
                                            <IoPersonOutline size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest">রেসিপিদাতা</p>
                                            <p className="text-sm font-bold dark:text-gray-200 truncate">{recipe.organizername}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#262525] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <IoStar key={i} size={16} className={i < Math.floor(averageRating) ? 'fill-current' : 'opacity-30'} />
                                            ))}
                                        </div>
                                        <span className="font-black text-lg dark:text-white">{averageRating}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">({ratingCount} রিভিউ)</span>
                                </div>

                                <div className="space-y-2">
                                    <a href={recipe.reference} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                                        <IoLinkOutline size={20} />
                                        <span className="truncate">রেফারেন্স লিংক</span>
                                    </a>
                                    {recipe.tutorialvideo && (
                                        <a href={recipe.tutorialvideo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 text-sm text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">
                                            <IoPlayCircleOutline size={20} />
                                            <span className="truncate">ভিডিও টিউটোরিয়াল</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Content & Actions */}
                        <div className="p-6 lg:p-10 space-y-8 pb-32 lg:pb-10">
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                                    <h3 className="text-xl font-black dark:text-white">বানানোর প্রক্রিয়া</h3>
                                </div>
                                <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line bg-rose-50/20 dark:bg-[#1b1b1b] p-6 lg:p-8 rounded-3xl border border-rose-100/50 dark:border-gray-800 relative">
                                    <div className="absolute top-4 right-6 text-rose-200 dark:text-gray-800 hidden sm:block">
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                                            <path d="M10 20h4l-2-6h-4l2 6zm10 0h4l-2-6h-4l2 6zM6 14c0-2.209 1.791-4 4-4s4 1.791 4 4v12l-4-4H6v-8zm10 0c0-2.209 1.791-4 4-4s4 1.791 4 4v12l-4-4h-4v-8z" />
                                        </svg>
                                    </div>
                                    {recipe.description
                                        .replace(/\r\n/g, '\n')
                                        .replace(/\\n/g, '\n')
                                        .replace(/\\r/g, '\n')
                                        .replace(/\n\s*\n/g, '\n\n')
                                        .replace(/(উপকরণ[:ঃ]|উপাদান[:ঃ])/g, '<b>$1</b>')
                                        .replace(/(প্রস্তুত প্রণালী[:ঃ]|বানানোর নিয়ম[:ঃ])/g, '<b>$1</b>')
                                        .split('\n').map((line, i) => (
                                            <span key={i} dangerouslySetInnerHTML={{ __html: line + '<br/>' }} />
                                        ))
                                    }
                                </div>
                            </section>

                            {recipe.comment && recipe.comment.trim() !== '' && (
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                                        <h3 className="text-xl font-black dark:text-white">বিশেষ মন্তব্য</h3>
                                    </div>
                                    <div className="bg-amber-50/40 dark:bg-amber-900/5 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
                                        {recipe.comment.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\n\s*\n/g, '\n\n')}
                                    </div>
                                </section>
                            )}

                            {/* Interaction Zone */}
                            <div className="pt-8 border-t dark:border-gray-800">
                                <h3 className="text-lg font-black dark:text-white mb-6">রেসিপিটি আপনার কেমন লেগেছে?</h3>

                                <div className="bg-gray-50 dark:bg-[#1b1b1b] p-6 rounded-3xl space-y-6">
                                    <div className="flex justify-center gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`transition-all duration-300 transform ${star <= rating ? 'text-yellow-400 scale-125' : 'text-gray-300 dark:text-gray-700 hover:text-yellow-200'} hover:scale-110`}
                                            >
                                                <IoStar size={36} className={star <= rating ? 'fill-current shadow-amber-500' : ''} />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="email"
                                            className="w-full px-6 py-4 bg-white dark:bg-[#262525] border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all dark:text-white"
                                            placeholder="আপনার ইমেইল দিন..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <button
                                            onClick={handleSubmitRating}
                                            className="absolute right-2 top-2 bottom-2 px-6 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/20 flex items-center gap-2 transition-transform active:scale-95"
                                        >
                                            <IoSend />
                                            জমা দিন
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4 text-center dark:text-gray-600 flex items-center justify-center gap-1 font-bold">
                                    <IoAlertCircleOutline /> এক ইমেইল থেকে একবারই রেটিং দেওয়া যাবে
                                </p>
                            </div>

                            {/* Action Row */}
                            <div className="pt-8 border-t dark:border-gray-800 flex items-center justify-between">
                                <button
                                    onClick={() => setReportOpen(!reportOpen)}
                                    className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-bold transition-colors text-sm"
                                >
                                    <IoAlertCircleOutline size={20} />
                                    রিপোর্ট/পরিবর্তন আবেদন
                                </button>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">আইডি: #{recipe.id}</span>
                            </div>

                            {/* Report Drawer/Overlay */}
                            {reportOpen && (
                                <div className="mt-6 bg-rose-50 dark:bg-rose-900/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/20 animate-reveal">
                                    <h3 className="font-black text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
                                        <IoAlertCircleOutline /> কেন রিপোর্ট/পরিবর্তন আবেদন করছেন?
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                        {reportReasons.map(({ id, label }) => (
                                            <button
                                                key={id}
                                                onClick={() => toggleReason(id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-bold text-xs text-left
                                                    ${selectedReasons.includes(id)
                                                        ? 'bg-rose-600 border-rose-600 text-white'
                                                        : 'bg-white dark:bg-[#262525] border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400'}`}
                                            >
                                                {selectedReasons.includes(id) && <IoCheckmarkCircle />}
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        rows={3}
                                        className="w-full bg-white dark:bg-[#262525] border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all dark:text-white"
                                        placeholder="অন্যান্য কিছু/পরিবর্তন এর কারণ বলুন..."
                                    />
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button onClick={() => setReportOpen(false)} className="px-6 py-2 text-gray-400 hover:text-gray-600 font-bold text-sm">বাতিল</button>
                                        <button
                                            onClick={handleReportSubmit}
                                            className="px-6 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all text-sm shadow-lg shadow-rose-600/20"
                                        >
                                            অ্যাডমিনকে জমা দিন
                                        </button>
                                    </div>
                                    {submitStatus === 'success' && <p className="text-green-600 font-bold text-xs mt-3 text-center">ধন্যবাদ, আপনার রিপোর্ট সফলভাবে জমা হয়েছে।</p>}
                                    {submitStatus === 'error' && <p className="text-rose-600 font-bold text-xs mt-3 text-center">দুঃখিত, আবার চেষ্টা করুন।</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
