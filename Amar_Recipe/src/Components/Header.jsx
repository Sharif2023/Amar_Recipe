import { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import logo from "../assets/Amar_Recipe_Header_Logo.svg";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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
            <nav className="bg-black p-2">
                <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">

                    <Link to={'/'}>
                        <div className="text-white font-bold text-2xl mb-4 lg:mb-0 hover:text-orange-600 hover:cursor-pointer inline-flex items-center gap-2"><img src={logo} className="w-8 h-8" alt="Amar Recipe Header Logo" />আমার রেসিপি</div>
                    </Link>

                    {/* Hamburger menu for small screens */}
                    <div className="lg:hidden">
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

                    <form className="max-w-lg mx-auto w-full" onSubmit={handleSearchSubmit}>
                        <div className="flex h-11.5">
                            {/* Dropdown Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    type="button"
                                    className="h-full z-10 inline-flex items-center justify-between gap-1 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-md hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <span>{selectedCategory || 'খাবারের ধরণ'}</span>
                                    <svg className="w-3 h-3 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute left-0 mt-1 w-44 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 ${dropdownOpen ? '' : 'hidden'}`}
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
                                        ]
                                            .map((item) => (
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
                            <div className="relative w-full">
                                <input
                                    type="search"
                                    name="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
                                    className="h-full block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 border-s-0 rounded-e-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
                                    placeholder="অনুসন্ধান করুন মাংস, শাকসবজি, সালাত, পানীয় আইটেম..."
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-[#1f1f1f] rounded-e-md border border-white hover:border-[#ff3300] hover:text-[#ff3300] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <span className="sr-only">Search</span>
                                </button>
                            </div>
                        </div>
                    </form>


                    {/* Navigation links */}
                    <div className={`lg:flex flex-col lg:flex-row ${isOpen ? 'block' : 'hidden'} lg:space-x-2 lg:mt-0 mt-4 flex flex-col items-center text-sm`}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? 'text-orange-600 px-2 py-2' : 'text-white px-2 py-2'}
                        >
                            রেসিপিগুলো দেখুন
                        </NavLink>
                        <NavLink
                            to="/submit"
                            className={({ isActive }) => isActive ? 'text-orange-600 px-2 py-2' : 'text-white px-2 py-2'}
                        >
                            নতুন রেসিপি যোগ করুন
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => isActive ? 'text-orange-600 px-2 py-2' : 'text-white px-2 py-2'}
                        >
                            আমাদের সম্পর্কে
                        </NavLink>
                    </div>
                </div>
            </nav >
        </div >
    );
}

export default Header;