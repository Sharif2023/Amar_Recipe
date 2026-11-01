import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import logo from "../assets/Amar_Recipe_Header_Logo.svg";
import { useUserAuth } from "../context/UserAuthContext";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, user, logout } = useUserAuth() || {};
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    // Close user dropdown on outside click
    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [userMenuOpen]);

    const categoryMapping = {
        "সকল রেসিপি": "AllRecipes",
        "মাংস": "Meat",
        "মাছ": "Fish",
        "ডিম": "Egg",
        "দুগ্ধজাত": "dairy",
        "শাকসবজি দিয়ে মাছ/মাংস/অন্যান্য": "VegetablewithMeatorFish",
        "শাকসবজি": "Vegetables",
        "ভর্তা": "Bharta",
        "সালাদ": "Salad",
        "আচার": "achar",
        "স্যুপ": "Soup",
        "পানীয়": "Drinks",
        "ডেজার্ট, মিষ্টান্ন": "Desserts",
        "রাইস আইটেম": "Rice_and_Pasta",
        "হালকা খাবার/ ফাস্টফুড": "Snacks",
        "সস/মশলা": "SaucesAndCondiments",
        "বাঙ্গালী": "Bangladeshi",
        "চাইনিজ্জ": "Chinese",
        "ইতালীয়ান": "Italian",
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleCategoryChange = (category) => {
        const mappedCategory = categoryMapping[category];
        setSelectedCategory(category);
        if (category === "সকল রেসিপি") {
            navigate("/"); // Redirect to home
        } else {
            navigate(`/browse-recipes?category=${encodeURIComponent(mappedCategory)}`);
        }
        setDropdownOpen(false); // Close the dropdown after selection
    };

    // Search handler to navigate with the search term
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/browse-recipes?searchTerm=${searchTerm}`);
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="bg-black p-2 sm:p-3">
                <div className="container mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-2">
                    <Link to={'/'} className="group shrink-0 lg:pr-2">
                        <div className="text-white font-bold text-xl sm:text-2xl inline-flex items-center gap-2 group-hover:text-orange-600 hover:cursor-pointer whitespace-nowrap">
                            <img src={logo} className="w-8 h-8 sm:w-9 sm:h-9 group-hover:animate-seesaw" alt="Amar Recipe Header Logo" />
                            আমার রেসিপি
                        </div>
                    </Link>

                    {/* Hamburger menu for small screens */}
                    <div className="lg:hidden self-end">
                        <button onClick={toggleMenu} className="text-white focus:outline-none">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    <form className="w-full max-w-xl lg:max-w-[360px] xl:max-w-[420px] mx-auto lg:mx-0 lg:justify-self-center lg:flex-shrink-0" onSubmit={handleSearchSubmit}>
                        <div className="flex h-11">
                            {/* Dropdown Button */}
                            <div className="relative shrink-0">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    type="button"
                                    className="h-full z-10 inline-flex items-center justify-between gap-1 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-md hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <span className="whitespace-nowrap">{selectedCategory || 'খাবারের ধরণ'}</span>
                                    <svg className="w-3 h-3 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>


                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute left-0 mt-1 w-44 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 ${dropdownOpen ? "" : "hidden"
                                        }`}
                                >
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        {[
                                            "সকল রেসিপি",
                                            "মাংস",
                                            "মাছ",
                                            "ডিম",
                                            "ভর্তা",
                                            "শাকসবজি",
                                            "শাকসবজি দিয়ে মাছ/মাংস/অন্যান্য",
                                            "দুগ্ধজাত",
                                            "আচার",
                                            "সালাদ",
                                            "স্যুপ",
                                            "পানীয়",
                                            "ডেজার্ট, মিষ্টান্ন",
                                            "রাইস আইটেম",
                                            "হালকা খাবার/ ফাস্টফুড",
                                            "সস/মশলা",
                                            "বাঙ্গালী",
                                            "চাইনিজ্জ",
                                            "ইতালীয়ান"
                                        ].map((item) => (
                                            <li key={item}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCategoryChange(item)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    {item}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="relative flex-1 min-w-0">
                                <input
                                    type="search"
                                    name="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
                                    className="h-full block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 border-s-0 rounded-e-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
                                    placeholder="রেসিপি খুঁজুন..."
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-[#1f1f1f] rounded-e-md border border-white hover:border-[#ff3300] hover:text-[#ff3300] focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-[#1a1a1a] dark:border-gray-700 dark:hover:border-orange-600"
                                >
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <span className="sr-only">খুঁজুন</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Navigation links */}
                    <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm w-full lg:w-auto lg:flex-nowrap lg:justify-end lg:gap-x-1 lg:overflow-hidden lg:flex-shrink-0 lg:pl-2`}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `inline-flex items-center px-1.5 sm:px-2 py-2 text-[10px] sm:text-[11px] lg:text-[10px] xl:text-sm whitespace-nowrap transition ${isActive ? 'text-orange-600' : 'text-white hover:text-orange-600'}`}
                        >
                            রেসিপিগুলো দেখুন
                        </NavLink>
                        <NavLink
                            to="/submit"
                            className={({ isActive }) => `inline-flex items-center px-1.5 sm:px-2 py-2 text-[10px] sm:text-[11px] lg:text-[10px] xl:text-sm whitespace-nowrap transition ${isActive ? 'text-orange-600' : 'text-white hover:text-orange-600'}`}
                        >
                            নতুন রেসিপি যোগ করুন
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => `inline-flex items-center px-1.5 sm:px-2 py-2 text-[10px] sm:text-[11px] lg:text-[10px] xl:text-sm whitespace-nowrap transition ${isActive ? 'text-orange-600' : 'text-white hover:text-orange-600'}`}
                        >
                            আমাদের সম্পর্কে
                        </NavLink>

                        <div className="hidden lg:block h-5 w-px bg-white/20 mx-1" aria-hidden="true"></div>

                        {isLoggedIn ? (
                            /* ── Logged-in: avatar + dropdown ── */
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    id="user-avatar-btn"
                                    type="button"
                                    onClick={() => setUserMenuOpen((o) => !o)}
                                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    {/* Avatar circle */}
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                                        {(user?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-white text-[11px] xl:text-sm font-semibold whitespace-nowrap max-w-[80px] truncate">
                                        {user?.name?.split(' ')[0] || 'প্রোফাইল'}
                                    </span>
                                    <svg className={`w-3 h-3 text-white/70 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => { setUserMenuOpen(false); setIsOpen(false); }}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                আমার প্রোফাইল
                                            </Link>
                                            <Link
                                                to="/submit"
                                                onClick={() => { setUserMenuOpen(false); setIsOpen(false); }}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                রেসিপি যোগ করুন
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                                            <button
                                                type="button"
                                                id="header-logout-btn"
                                                onClick={async () => {
                                                    setUserMenuOpen(false);
                                                    setIsOpen(false);
                                                    await logout();
                                                    navigate('/');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                লগআউট
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ── Logged-out: Login + Signup buttons ── */
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => `inline-flex items-center px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] xl:text-sm whitespace-nowrap rounded-lg transition font-semibold ${isActive ? 'text-orange-400 bg-white/10' : 'text-white hover:bg-white/10'}`}
                                >
                                    লগইন
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    className={({ isActive }) => `inline-flex items-center px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] xl:text-sm whitespace-nowrap rounded-lg border transition font-bold ${isActive ? 'bg-orange-600 border-orange-600 text-white' : 'border-white/30 text-white hover:bg-white hover:text-black'}`}
                                >
                                    সাইনআপ
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </nav >
        </div >
    );
}

export default Header;