import React, { useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

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

const AdminViewRecipeModal = ({ isOpen, onClose, recipe, onSave }) => {
  if (!isOpen || !recipe) return null;

  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [isEditing, setIsEditing] = useState({});

  useEffect(() => {
    console.log('Recipe Data:', recipe);
    if (recipe) {
      setEditedRecipe({
        ...recipe,
        id: recipe.id || recipe.recipe_id
      });
    }
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = () => {
    console.log("Saving Recipe:", editedRecipe);
    onSave(editedRecipe);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1b1b1b] rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold dark:text-white mb-6">রেসিপি এডিট</h2>

          {/* Editable Title */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">রেসিপির নামঃ</label>
            <div className="flex items-center gap-2">
              {isEditing.title ? (
                <input
                  type="text"
                  name="title"
                  value={editedRecipe.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <span className="flex-1 text-gray-700 dark:text-gray-300">{editedRecipe.title}</span>
              )}
              <button
                onClick={() => toggleEdit('title')}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isEditing.title ? 'সংরক্ষণ করুণ' : 'পরিবর্তন করুণ'}
              </button>
            </div>
          </div>

          {/* Editable Image URL */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">ছবিটির পথঃ</label>
            <div className="flex items-center gap-2">
              <img
                src={editedRecipe.image_url ? API_CONFIG.BASE_URL + '/' + editedRecipe.image_url : 'https://dummyimage.com/400x300/000/fff&text=No+Image'}
                alt={editedRecipe.title}
                className="w-[100px] h-[75px] object-cover rounded-md mb-4"
              />
              {isEditing.image_url ? (
                <input
                  type="text"
                  name="image_url"
                  value={editedRecipe.image_url}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <span className="flex-1 text-gray-700 dark:text-gray-300">{editedRecipe.image_url}</span>
              )}
              <button
                onClick={() => toggleEdit('image_url')}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isEditing.image_url ? 'সংরক্ষণ করুণ' : 'পরিবর্তন করুণ'}
              </button>
            </div>
          </div>

          {/* Category Display */}
          <p className="text-gray-700 dark:text-gray-300 mb-2 py-2">
            <strong>রেসিপির ধরণঃ</strong> {categoryBanglaMap[editedRecipe.category] || editedRecipe.category}
          </p>

          {/* Editable Description */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">বানানোর প্রক্রিয়াঃ</label>
            <div className="flex items-center gap-2">
              {isEditing.description ? (
                <textarea
                  name="description"
                  value={editedRecipe.description.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\n\s*\n/g, '\n\n')}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <span className="flex-1 text-gray-700 dark:text-gray-300">{editedRecipe.description.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\n\s*\n/g, '\n\n')}</span>
              )}
              <button
                onClick={() => toggleEdit('description')}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isEditing.description ? 'সংরক্ষণ করুণ' : 'পরিবর্তন করুণ'}
              </button>
            </div>
          </div>

          {/* Editable Comment */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">মন্তব্যঃ</label>
            <div className="flex items-center gap-2">
              {isEditing.comment ? (
                <input
                  type="text"
                  name="comment"
                  value={editedRecipe.comment.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\n\s*\n/g, '\n\n')}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <span className="flex-1 text-gray-700 dark:text-gray-300">{editedRecipe.comment.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\n\s*\n/g, '\n\n') || 'No comments available'}</span>
              )}
              <button
                onClick={() => toggleEdit('comment')}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isEditing.comment ? 'সংরক্ষণ করুণ' : 'পরিবর্তন করুণ'}
              </button>
            </div>
          </div>

          {/* Editable Location */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">রেসিপিটির উৎপত্তিস্থলঃ</label>
            <div className="flex items-center gap-2">
              {isEditing.location ? (
                <input
                  type="text"
                  name="location"
                  value={editedRecipe.location}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <span className="flex-1 text-gray-700 dark:text-gray-300">{editedRecipe.location}</span>
              )}
              <button
                onClick={() => toggleEdit('location')}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isEditing.location ? 'সংরক্ষণ করুণ' : 'পরিবর্তন করুণ'}
              </button>
            </div>
          </div>

          {/* Editable Organizer Name */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">রেসিপিদাতার নামঃ</label>
            <div className="flex items-center gap-2">
              {isEditing.organizerName ? (
                <input
                  type="text"
                  name="organizerName"
                  value={editedRecipe.organizerName}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <span className="flex-1 text-gray-700 dark:text-gray-300">{editedRecipe.organizerName}</span>
              )}
              <button
                onClick={() => toggleEdit('organizerName')}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isEditing.organizerName ? 'সংরক্ষণ করুণ' : 'পরিবর্তন করুণ'}
              </button>
            </div>
          </div>

          {/* Editable Organizer Email */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">রেসিপিদাতার ইমেইলঃ</label>
            <div className="flex items-center gap-2">
              {isEditing.organizerEmail ? (
                <input
                  type="email"
                  name="organizerEmail"
                  value={editedRecipe.organizerEmail}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <span className="flex-1 text-gray-700 dark:text-gray-300">{editedRecipe.organizerEmail}</span>
              )}
              <button
                onClick={() => toggleEdit('organizerEmail')}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isEditing.organizerEmail ? 'সংরক্ষণ করুণ' : 'পরিবর্তন করুণ'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              বাতিল করুণ
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700">
              পরিবর্তনগুলো সংরক্ষণ করুণ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewRecipeModal;
