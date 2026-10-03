import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { useNavigate, Link } from "react-router-dom";
import { useModal } from '../context/ModalContext';

const AdminLogin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useModal();

    const handleLogIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(API_BASE_URL + "admin_login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                const fullProfileImage = data.admin.profile_image?.startsWith("http")
                    ? data.admin.profile_image
                    : API_BASE_URL + data.admin.profile_image;

                const adminWithFullImage = {
                    ...data.admin,
                    profileImage: fullProfileImage
                };

                localStorage.setItem("admin", JSON.stringify(adminWithFullImage));
                navigate("/adminpanel");
            } else {
                await showAlert(data.message || "লগইন ব্যর্থ হয়েছে।");
            }
        } catch (error) {
            console.error("Login error:", error);
            await showAlert("লগইন করার সময় নেটওয়ার্কে সমস্যা হয়েছে।");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-5 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl px-8 py-10 flex flex-col w-full max-w-md dark:bg-gray-900/90 border border-gray-100 dark:border-gray-700 animate-reveal">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                        অ্যাডমিন প্যানেল
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
                </div>
                <form onSubmit={handleLogIn} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                            ইমেইল <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            পাসওয়ার্ড <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/30 hover:-translate-y-1 active:translate-y-0 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : 'লগইন করুন'}
                    </button>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3 text-sm font-medium">
                        <div className="flex gap-4">
                            <a href='https://youtu.be/0vZDbKSGAJ0' target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                                অ্যাডমিন একাউন্ট খুলুন
                            </a>
                            <Link to={'#'} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-colors">
                                পাসওয়ার্ড ভুলে গেছেন?
                            </Link>
                        </div>
                        <Link to='#' className="text-green-600 hover:text-green-700 dark:text-green-400 transition-colors">
                            কিভাবে অ্যাডমিন হবেন?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

