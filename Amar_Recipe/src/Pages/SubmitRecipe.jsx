import React, { useState } from 'react';
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

export default function SubmitRecipe() {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        image: null,
        location: '',
        organizerName: '',
        organizerEmail: '',
        organizerAddress: '',
        status: '',
        tags: '',
        reference: '',
        tutorialVideo: '',
        comment: '',
        source: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch(getApiUrl(API_CONFIG.RECIPES.SUBMIT_REQUEST), {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (result.success) {
                alert('Recipe Submitted Successfully!');
                // Optionally clear the form
                setFormData({
                    title: '',
                    category: '',
                    description: '',
                    image: null,
                    location: '',
                    organizerName: '',
                    organizerEmail: '',
                    organizerAddress: '',
                    status: '',
                    tags: '',
                    reference: '',
                    tutorialVideo: '',
                    comment: '',
                    source: '',
                });
            } else {
                alert('Submission failed: ' + result.message);
            }
        } catch (error) {
            alert('Error submitting form: ' + error.message);
        }

        setIsSubmitting(false);
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-black mb-6">নতুন রেসিপি যোগকরণ</h1>

            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                {/* Title */}
                <input
                    type="text"
                    name="title"
                    placeholder="রেসিপির নাম"
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327]"
                    style={{ backgroundColor: '#f6f6f6' }}
                    value={formData.title}
                    onChange={handleChange}
                />

                {/* Category */}
                <select
                    name="category"
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327]"
                    style={{ backgroundColor: '#f6f6f6' }}
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="" selected disabled hidden>রেসিপির ধরণ</option>
                    <option value="Meat">মাংস</option>
                    <option value="Fish">মাছ</option>
                    <option value="Egg">ডিম</option>
                    <option value="dairy">দুগ্ধজাত</option>
                    <option value="VegetablewithMeatorFish">শাকসবজি দিয়ে মাছ/মাংস/অন্যান্য</option>
                    <option value="Vegetables">শাকসবজি</option>
                    <option value="Bharta">ভর্তা</option>
                    <option value="Salad">সালাদ</option>
                    <option value="achar">আচার</option>
                    <option value="Soup">স্যুপ</option>
                    <option value="Drinks">পানীয়</option>
                    <option value="Desserts">ডেজার্ট, মিষ্টান্ন</option>
                    <option value="Rice_and_Pasta">রাইস আইটেম</option>
                    <option value="Snacks">হালকা খাবার/ ফাস্টফুড</option>
                    <option value="SaucesAndCondiments">সস/মশলা</option>
                    <option value="Bangladeshi">বাঙ্গালী</option>
                    <option value="Chinese">চাইনিজ্জ</option>
                    <option value="Italian">ইতালীয়ান</option>

                </select>

                {/* Description & Image Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <textarea
                        name="description"
                        rows="4"
                        placeholder="বানানোর প্রক্রিয়া"
                        className="block w-full h-48 p-2 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327]"
                        style={{ backgroundColor: '#f6f6f6' }}
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <div>
                        <label
                            htmlFor="image"
                            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
                        >
                            <span className="text-center text-gray-500">
                                <div className="mb-2">
                                    <span className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4">
                                        ছবি যোগ করুন
                                    </span>
                                </div>
                                or drag recipe photo here<br />
                                <span className="text-sm">PNG, JPG, JPEG</span>
                            </span>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleChange}
                            />
                        </label>
                        {/* Show filename if an image is selected */}
                        {formData.image && (
                            <p className="mt-2 text-gray-700 text-sm">
                                Selected file: <strong>{formData.image.name}</strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* Location */}
                <input
                    type="text"
                    name="location"
                    placeholder="অঞ্চল বা রান্নাটির উৎপত্তি"
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327]"
                    style={{ backgroundColor: '#f6f6f6' }}
                    value={formData.location}
                    onChange={handleChange}
                />

                {/* Submitter Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="organizerName"
                        placeholder="আপনার নাম"
                        className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327]"
                        style={{ backgroundColor: '#f6f6f6' }}
                        value={formData.organizerName}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="organizerEmail"
                        placeholder="আপনার ই-মেইল"
                        className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327]"
                        style={{ backgroundColor: '#f6f6f6' }}
                        value={formData.organizerEmail}
                        onChange={handleChange}
                    />
                </div>

                {/* Address */}
                <input
                    type="text"
                    name="organizerAddress"
                    placeholder="আপনার ঠিকানা"
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327]"
                    style={{ backgroundColor: '#f6f6f6' }}
                    value={formData.organizerAddress}
                    onChange={handleChange}
                />

                {/* Status & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select
                        name="source"
                        className="block w-full h-12 rounded-md border-gray-300 shadow-sm"
                        style={{ backgroundColor: '#f6f6f6' }}
                        value={formData.source}
                        onChange={handleChange}
                    >
                        <option value="" selected disabled hidden>রেসিপিটির সন্ধান কোথা থেকে পেয়েছেন?</option>
                        <option value="family">পরিবার</option>
                        <option value="friends">বন্ধু-বান্ধব</option>
                        <option value="internet">সোশ্যাল মিডিয়া</option>
                        <option value="books">রান্নার বই থেকে</option>
                        <option value="self">আমার নিজের</option>
                        <option value="other">অন্যান্য</option>
                    </select>

                    <input
                        type="text"
                        name="tags"
                        placeholder="ট্যাগ (শুরুতে # এবং শেষে ',')"
                        className="block w-full h-12 rounded-md border-gray-300 shadow-sm"
                        style={{ backgroundColor: '#f6f6f6' }}
                        value={formData.tags}
                        onChange={handleChange}
                    />
                </div>

                {/* Reference & Tutorial Video */}
                <input
                    type="url"
                    name="reference"
                    placeholder="রেফারেন্স লিংক (যদি থাকে)"
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                    style={{ backgroundColor: '#f6f6f6' }}
                    value={formData.reference}
                    onChange={handleChange}
                />
                <input
                    type="url"
                    name="tutorialVideo"
                    placeholder="টিউটোরিয়াল ভিডিও লিংক (ইউটিউব ইত্যাদি)"
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                    style={{ backgroundColor: '#f6f6f6' }}
                    value={formData.tutorialVideo}
                    onChange={handleChange}
                />

                <textarea
                    name="comment"
                    rows="4"
                    placeholder="ভিউয়ার দের জন্য মতামত থাকলে দিতে পারেন"
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                    style={{ backgroundColor: '#f6f6f6' }}
                    value={formData.comment}
                    onChange={handleChange}
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
                >
                    যোগ করুন
                </button>
            </form>
            {isSubmitting && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                    style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', padding: '1rem' }}
                >
                    সাবমিশন প্রসেস চলমান, দয়া করে অপেক্ষা করুণ।
                </div>
            )}
        </div>
    );
}
