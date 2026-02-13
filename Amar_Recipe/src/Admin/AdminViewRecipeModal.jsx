import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
const backendBaseUrl = API_BASE_URL;

const AdminRecipeModal = ({ isOpen, onClose, recipe, onSave, mode = 'view' }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [recipe]);

  if (!isOpen || !recipe) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Pass both metadata and the new image file if selected
      await onSave(formData, selectedImage);
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1b1b1b] rounded-lg max-w-2xl w-full overflow-y-auto max-h-[90vh] shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between relative mb-4">
              <h2 className="text-2xl font-bold dark:text-white tracking-tight">
                {isEdit ? 'রেসিপি এডিট করুন' : recipe.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:text-[#ff3300] dark:text-gray-400 dark:hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative group">
              <img
                src={imagePreview || (recipe.image_url
                  ? (recipe.image_url.startsWith('http') ? recipe.image_url : backendBaseUrl + recipe.image_url)
                  : 'https://via.placeholder.com/400x300?text=No+Image')}
                alt={recipe.title}
                className="w-full h-full object-cover rounded-md mb-4 max-h-64"
              />
              {isEdit && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-md mb-4">
                  <label className="cursor-pointer bg-white/90 dark:bg-black/80 text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    ছবি পরিবর্তন করুন
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold dark:text-gray-300 mb-1">রেসিপির নাম</label>
                {isEdit ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{recipe.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold dark:text-gray-300 mb-1">রেসিপির ধরণ</label>
                {isEdit ? (
                  <input
                    type="text"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{recipe.category}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold dark:text-gray-300 mb-1">বানানোর প্রক্রিয়া</label>
                {isEdit ? (
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows="6"
                    className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {recipe.description?.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n')}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold dark:text-gray-300 mb-1">মন্তব্য</label>
                {isEdit ? (
                  <textarea
                    name="comment"
                    value={formData.comment || ''}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {recipe.comment ? recipe.comment.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n') : 'নেই'}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300">রেফারেন্স লিংক</label>
                  {isEdit ? (
                    <input
                      type="url"
                      name="reference"
                      value={formData.reference || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                    />
                  ) : (
                    <a href={recipe.reference} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm truncate block">
                      {recipe.reference || 'নেই'}
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300">ভিডিও টিউটোরিয়াল</label>
                  {isEdit ? (
                    <input
                      type="url"
                      name="tutorialvideo"
                      value={formData.tutorialvideo || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                    />
                  ) : (
                    <a href={recipe.tutorialvideo} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm truncate block">
                      {recipe.tutorialvideo || 'নেই'}
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300">রেসিপিদাতার নাম</label>
                  {isEdit ? (
                    <input
                      type="text"
                      name="organizername"
                      value={formData.organizername || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-sm dark:text-gray-400">{recipe.organizername}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300">ইমেইল</label>
                  {isEdit ? (
                    <input
                      type="email"
                      name="organizeremail"
                      value={formData.organizeremail || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded dark:bg-[#262525] dark:border-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-sm dark:text-gray-400">{recipe.organizeremail || 'নাই'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center p-4 border-t gap-4">
            {isEdit ? (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'সেভ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border rounded dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  বাতিল
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700 transition"
              >
                বন্ধ করুন
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRecipeModal;
