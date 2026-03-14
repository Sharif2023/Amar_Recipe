import React, { useState } from 'react';
import { API_BASE_URL, ADMIN_API_BASE_URL } from '../config/api';
import Loader from '../Components/Loader';

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
    const [imagePreview, setImagePreview] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState({ message: '', type: '' }); // { message: '', type: 'success' | 'error' }
    const fileInputRef = React.useRef(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                console.warn("Compression timed out, using original file.");
                resolve(file);
            }, 8000); // 8 second timeout

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onerror = () => {
                clearTimeout(timeoutId);
                console.error("FileReader error, using original file.");
                resolve(file);
            };
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onerror = () => {
                    clearTimeout(timeoutId);
                    console.error("Image load error, using original file.");
                    resolve(file);
                };
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 1280;
                        const MAX_HEIGHT = 1280;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, width, height);

                        canvas.toBlob((blob) => {
                            clearTimeout(timeoutId);
                            if (!blob) {
                                resolve(file);
                                return;
                            }
                            resolve(new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            }));
                        }, 'image/jpeg', 0.8);
                    } catch (e) {
                        clearTimeout(timeoutId);
                        resolve(file);
                    }
                };
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) {
                if (key === 'image' && formData[key] instanceof File) {
                    // Compress image before appending
                    const compressedFile = await compressImage(formData[key]);
                    data.append(key, compressedFile);
                } else {
                    data.append(key, formData[key]);
                }
            }
        }

        try {
            const response = await fetch(API_BASE_URL + 'submit_recipe_request.php', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText.substring(0, 100)}`);
            }

            const result = await response.json();

            if (result.success) {
                setSubmissionStatus({ message: result.message || 'আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!', type: 'success' });
                // Reset form and related states
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
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setSubmissionStatus({ message: 'সাবমিশন ব্যর্থ হয়েছে: ' + (result.message || 'অজানা ত্রুটি'), type: 'error' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            setSubmissionStatus({ message: 'ত্রুটি: ' + error.message, type: 'error' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setIsSubmitting(false);
    };


    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-rose-50/50 to-orange-50/50 dark:from-[#1b1b1b] dark:to-[#121212] py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#262525] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 dark:border-gray-800 transition-all duration-500">
                <div className="p-8 sm:p-12">
                    <header className="mb-10 text-center">
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                            আপনার রেসিপি <span className="text-[#8c0327] dark:text-rose-500">শেয়ার করুন</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">সহজেই আপনার রেসিপিটি সকলের মাঝে পৌঁছে দিন।</p>
                    </header>

                    {submissionStatus.message && (
                        <div className={`mb-10 p-6 rounded-2xl flex items-start gap-4 animate-in fade-in zoom-in-95 duration-500 ${submissionStatus.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/30'}`}>
                            <div className="mt-1 flex-shrink-0">
                                {submissionStatus.type === 'success' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                )}
                            </div>
                            <p className="font-semibold text-lg leading-snug">{submissionStatus.message}</p>
                        </div>
                    )}

                    <form className="space-y-10" onSubmit={handleSubmit}>
                        {/* Basic Info Group */}
                        <section className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-l-4 border-[#8c0327] pl-4 mb-6">প্রাথমিক তথ্য</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">রেসিপির নাম *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        placeholder="মজাদার খাবারের নাম..."
                                        className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium shadow-inner"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">রেসিপির ধরন *</label>
                                    <select
                                        name="category"
                                        required
                                        className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium shadow-inner cursor-pointer"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>সিলেক্ট করুন...</option>
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
                                </div>
                            </div>
                        </section>

                        {/* Process & Photo Group */}
                        <section className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-l-4 border-[#8c0327] pl-4 mb-6">রান্নার প্রক্রিয়া ও ছবি</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">বানানোর প্রক্রিয়া *</label>
                                    <textarea
                                        name="description"
                                        rows="8"
                                        required
                                        placeholder="ধাপে ধাপে রান্নার পদ্ধতি লিখুন..."
                                        className="block w-full p-5 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium shadow-inner resize-none h-[280px]"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">রেসিপির ছবি *</label>
                                    <label
                                        htmlFor="image"
                                        className="relative w-full h-[280px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl cursor-pointer flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1b1b1b] hover:bg-gray-100 dark:hover:bg-[#222] transition-all overflow-hidden group shadow-inner"
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                    <span className="font-bold">ছবি পরিবর্তন করুন</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-center p-6">
                                                <div className="mb-4 p-4 rounded-full bg-rose-50 dark:bg-rose-900/10 text-[#8c0327] dark:text-rose-500">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <span className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-xl py-2 px-6 font-bold shadow-lg transition-all mb-3">
                                                    ছবি আপলোড করুন
                                                </span>
                                                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">PNG, JPG, JPEG (Max 10MB)</p>
                                            </div>
                                        )}
                                        <input
                                            id="image"
                                            name="image"
                                            type="file"
                                            required={!imagePreview}
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleChange}
                                            ref={fileInputRef}
                                        />
                                    </label>
                                    {formData.image && (
                                        <p className="mt-2 text-gray-500 text-xs font-bold truncate">আবদ্ধ ফাইল: {formData.image.name}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Extra Detail Group */}
                        <section className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-l-4 border-[#8c0327] pl-4 mb-6">অন্যান্য তথ্য</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">অঞ্চল বা রেসিপির উৎপত্তিস্থল *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        placeholder="উদা: ঢাকা, চট্টগ্রাম, বা দেশের নাম..."
                                        className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">রান্নার সন্ধান কীভাবে পেলেন?</label>
                                    <select
                                        name="source"
                                        className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium cursor-pointer"
                                        value={formData.source}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>উৎস সিলেক্ট করুন...</option>
                                        <option value="family">পরিবার</option>
                                        <option value="friends">বন্ধু-বান্ধব</option>
                                        <option value="internet">সোশ্যাল মিডিয়া</option>
                                        <option value="books">রান্নার বই থেকে</option>
                                        <option value="self">আমার নিজের</option>
                                        <option value="other">অন্যান্য</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Submitter Info Group */}
                        <section className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-l-4 border-[#8c0327] pl-4 mb-6">আপনার তথ্য</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">আপনার নাম *</label>
                                    <input
                                        type="text"
                                        name="organizerName"
                                        required
                                        placeholder="নাম লিখুন..."
                                        className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                        value={formData.organizerName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">ই-মেইল *</label>
                                    <input
                                        type="email"
                                        name="organizerEmail"
                                        required
                                        placeholder="example@mail.com"
                                        className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                        value={formData.organizerEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">আপনার ঠিকানা *</label>
                                <input
                                    type="text"
                                    name="organizerAddress"
                                    required
                                    placeholder="বাসা নম্বর, সড়ক, এলাকা..."
                                    className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                    value={formData.organizerAddress}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Final Links & Comments */}
                        <section className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">ট্যাগ (শুরুতে # এবং শেষে ',')</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        placeholder="#দেশি_খাবার, #সহজ_রান্না..."
                                        className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                        value={formData.tags}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">রেফারেন্স লিংক (যদি থাকে)</label>
                                        <input
                                            type="url"
                                            name="reference"
                                            placeholder="https://..."
                                            className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                            value={formData.reference}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">টিউটোরিয়াল ভিডিও লিংক</label>
                                        <input
                                            type="url"
                                            name="tutorialVideo"
                                            placeholder="https://youtube.com/..."
                                            className="block w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                            value={formData.tutorialVideo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">আপনার মতামত</label>
                                    <textarea
                                        name="comment"
                                        rows="3"
                                        placeholder="ভিউয়ারদের জন্য কোনো বিশেষ বার্তা..."
                                        className="block w-full p-5 rounded-2xl bg-gray-50 dark:bg-[#1b1b1b] border-2 border-transparent focus:border-[#8c0327] dark:focus:border-rose-600 outline-none transition-all dark:text-white font-medium"
                                        value={formData.comment}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-black py-5 px-8 rounded-3xl text-xl shadow-[0_15px_30px_rgba(140,3,39,0.3)] hover:shadow-[0_20px_40px_rgba(140,3,39,0.4)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            প্রসেসিং...
                                        </>
                                    ) : 'রেসিপিটি জমা দিন'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {isSubmitting && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[100] animate-in fade-in duration-300">
                    <Loader message="আপনার রেসিপিটি নিরাপদে জমা করা হচ্ছে... দয়া করে অপেক্ষা করুণ।" />
                </div>
            )}
        </div>
    );
}

