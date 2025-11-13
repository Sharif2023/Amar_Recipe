import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        date: "",
        area: "",
        city: "",
        state: "",
        postcode: "",
        experience: "",
        specialty: "",
        portfolio: "",
        certification: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(getApiUrl('/admin_signup.php'), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const text = await res.text();
            try {
                const data = JSON.parse(text);
                alert(data.message);

                if (data.message === "আপনার সাইনআপ ফর্মটি অ্যাডমিনের পর্যালোচনার জন্য জমা হয়েছে।") {
                    setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        date: "",
                        area: "",
                        city: "",
                        state: "",
                        postcode: "",
                        experience: "",
                        specialty: "",
                        portfolio: "",
                        certification: "",
                        password: "",
                        confirmPassword: "",
                    });
                }
            } catch (err) {
                console.error("Non-JSON response:", text);
                alert("সার্ভার ত্রুটি: response was not JSON. See console.");
            }
        } catch (error) {
            console.error("সাইনআপ ব্যার্থ হয়েছে:", error);
            alert("সাইনআপ ব্যার্থ হয়েছে: নেটওয়ার্ক সমস্যা অথবা সার্ভার ত্রুটি। দয়া করে পরে আবার চেষ্টা করুন।");
        }
    };

    return (
        <div className="flex items-center justify-center p-12 min-h-screen bg-gray-100 bg-cover" style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/039/070/453/non_2x/cooking-background-vegetables-spices-and-kitchen-utensils-on-the-table-on-a-gray-stone-background-restaurant-menu-photo.jpg')" }}>
            <div className="w-full max-w-2xl bg-white p-10 rounded shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-rose-700">অ্যাডমিন সাইনআপ ফর্ম</h2>
                <form onSubmit={handleSubmit}>
                    {[
                        { label: "নাম", name: "name", type: "text" },
                        { label: "মোবাইল নং", name: "phone", type: "text" },
                        { label: "ইমেইল", name: "email", type: "email" },
                        { label: "জন্মতারিখ", name: "date", type: "date" },
                        { label: "এলাকা", name: "area", type: "text" },
                        { label: "শহর", name: "city", type: "text" },
                        { label: "বিভাগ", name: "state", type: "text" },
                        { label: "পোস্ট নং", name: "postcode", type: "text" },
                        { label: "আপনার রান্নাবান্নার অভিজ্ঞতার বয়স", name: "experience", type: "number" , min: "0", max: "50" },
                        { label: "দক্ষতা (e.g., মিষ্টিজাত, শাকসবজি, ...)", name: "specialty", type: "text" },
                        { label: "পোর্টফোলিও লিংক (অপশনাল)", name: "portfolio", type: "url" },
                        { label: "আপনার সার্টিফিকেশন তথ্য", name: "certification", type: "textarea" },
                        { label: "পাসওয়ার্ড", name: "password", type: "password" },
                        { label: "কনফার্ম পাসওয়ার্ড", name: "confirmPassword", type: "password" },
                    ].map(({ label, name, type }) => (
                        <div className="mb-4" key={name}>
                            <label className="block mb-2 text-gray-700 font-medium" htmlFor={name}>
                                {label}
                            </label>
                            {type === "textarea" ? (
                                <textarea
                                    name={name}
                                    id={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-rose-500"
                                />
                            ) : (
                                <input
                                    type={type}
                                    name={name}
                                    id={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required={["name", "phone", "date", "email", "certification", "password", "confirmPassword"].includes(name)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-rose-500"
                                />
                            )}
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full bg-rose-700 text-white py-3 rounded hover:bg-rose-900 transition font-semibold"
                    >
                    ফর্ম জমা দিন
                    </button>

                    <div className="flex text-sm text-blue-700 underline space-x-2 items-center justify-center py-2.5">
                        <Link to='/adminlogin'>
                        ইতিমধ্যেই অ্যাকাউন্ট আছে? সাইনইন করুন
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSignup;
