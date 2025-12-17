import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';
const backendBaseUrl = API_BASE_URL;

const RecipeDetail = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1b1b1b] rounded-lg max-w-2xl w-full overflow-y-auto max-h-[90vh] shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-center relative mb-4">
            <h2 className="text-2xl font-bold dark:text-white tracking-tight">{recipe.title}</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 absolute right-0 cursor-pointer hover:text-[#ff3300]" onClick={onClose}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <img
            src={recipe.image_url ? backendBaseUrl + recipe.image_url : 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-md mb-4"
          />

          <p className="text-gray-700 dark:text-gray-300 mb-2 py-2"><strong>রেসিপির নাম</strong> {recipe.title}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-2 py-2">
            <strong>রেসিপির ধরণ:</strong> {recipe.category}
          </p>

          <p
            className="text-gray-700 dark:text-gray-300 mb-2 py-2"
            style={{ whiteSpace: 'pre-line' }}
          >
            <strong>বানানোর প্রক্রিয়া:</strong><br /><br />{' '}
            {recipe.description.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\n\s*\n/g, '\n\n')}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>মন্তব্য:</strong><br /><br /> {recipe.comment && recipe.comment.trim() !== '' ? recipe.comment.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\n\s*\n/g, '\n\n') : 'নেই'}
          </p>

          <div className="border-t pt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>রেফারেন্স লিংক:</strong>{' '}
              <a
                href={recipe.reference}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {recipe.reference}
              </a>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>ভিডিও টিউটোরিয়াল:</strong>{' '}
              <a
                href={recipe.tutorialVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {recipe.tutorialVideo && recipe.tutorialVideo.trim() !== '' ? recipe.tutorialVideo : 'নেই'}
              </a>
            </p>

          </div>
          <div className="border-t pt-4 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>রেসিপিটির উৎপত্তিস্থল:</strong> {recipe.location}</p>
            <p><strong>রেসিপিদাতার নাম:</strong> {recipe.organizerName}</p>
            <p><strong>ইমেইল:</strong> {recipe.organizerEmail}</p>
          </div>
        </div>
        <div className="flex justify-center items-center p-4 border-t">
          <button
            onClick={onClose}
            className="flex bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
