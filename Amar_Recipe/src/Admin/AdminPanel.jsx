import React, { useState, useEffect } from 'react';
import AdminHeader from "../Components/AdminHeader";
import AdminFooter from '../Components/AdminFooter';
import { IoStar, IoTrashBinOutline, IoPencilOutline, IoEyeOutline } from 'react-icons/io5';
import AdminViewRecipeModal from './AdminViewRecipeModal';
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const AdminPanel = () => {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseImageUrl = `${API_CONFIG.BASE_URL}/`;

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(getApiUrl(API_CONFIG.RECIPES.GET_ALL));
        if (!res.ok) throw new Error('Failed to fetch recipes');
        const data = await res.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleSaveRecipe = async (updatedRecipe) => {
    try {
      const res = await fetch(getApiUrl(API_CONFIG.RECIPES.UPDATE), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe),
      });
  
      const json = await res.json();
      if (json.success) {
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === updatedRecipe.id ? { ...r, ...updatedRecipe } : r
          )
        );
        alert('রেসিপি সফলভাবে আপডেট করা হয়েছে।');
        setShowModal(false);
      } else {
        alert('রেসিপি আপডেট করা যায়নি: ' + json.message);
      }
    } catch (error) {
      alert('রেসিপি আপডেট করার সময় ত্রুটি: ' + error.message);
    }
  };  

  const handleDelete = async (recipe) => {
    const confirmDelete = window.confirm(`আপনি কি নিশ্চিত যে রেসিপি মুছে ফেলতে চান "${recipe.title}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(getApiUrl(API_CONFIG.RECIPES.DELETE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: recipe.id }),
      });

      const json = await res.json();
      if (json.success) {
        setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
        alert('রেসিপিটি সফলভাবে মুছে ফেলা হয়েছে।');
      } else {
        alert('রেসিপি মুছে ফেলা যায়নি: ' + json.message);
      }
    } catch (error) {
      alert('রেসিপি মুছে ফেলার সময় ত্রুটি: ' + error.message);
    }
  };

  // Pagination rendering (same as your existing code)
  const renderPagination = () => {
    if (totalPages <= 7) {
      return [...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1;
        const isActive = pageNum === currentPage;
        return (
          <li key={pageNum}>
            <button
              onClick={() => handlePageChange(pageNum)}
              className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${isActive
                ? 'bg-blue-50 text-rose-600 dark:bg-gray-700 dark:text-white'
                : 'bg-white text-gray-500'
                }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          </li>
        );
      });
    }

    const pages = [];
    const leftSiblingIndex = Math.max(currentPage - 1, 2);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

    const addPage = (pageNum) => {
      const isActive = pageNum === currentPage;
      pages.push(
        <li key={pageNum}>
          <button
            onClick={() => handlePageChange(pageNum)}
            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${isActive
              ? 'bg-blue-50 text-rose-600 dark:bg-gray-700 dark:text-white'
              : 'bg-white text-gray-500'
              }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        </li>
      );
    };

    addPage(1);

    if (leftSiblingIndex > 2) {
      pages.push(
        <li
          key="left-ellipsis"
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 dark:text-gray-400 select-none"
        >
          ...
        </li>
      );
    } else {
      for (let i = 2; i < leftSiblingIndex; i++) {
        addPage(i);
      }
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      addPage(i);
    }

    if (rightSiblingIndex < totalPages - 1) {
      pages.push(
        <li
          key="right-ellipsis"
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 dark:text-gray-400 select-none"
        >
          ...
        </li>
      );
    } else {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
        addPage(i);
      }
    }

    addPage(totalPages);

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-[#1b1b1b]">
        <p className="text-lg dark:text-white">লোড হচ্ছে, অপেক্ষা করুন...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-[#1b1b1b]">
        <p className="text-red-500 text-lg">ত্রুটি: {error}</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="w-full min-h-screen bg-rose-100/30 dark:bg-[#1b1b1b] py-10 px-4">
        {currentRecipes.length === 0 ? (
          <p className="text-center dark:text-gray-300">কোন রেসিপি পাওয়া যায়নি।</p>
        ) : (
          <ul className="divide-y divide-gray-300 dark:divide-gray-700 max-w-4xl mx-auto">
            {currentRecipes.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 py-4 px-2 bg-white dark:bg-[#262525] rounded-md shadow hover:shadow-lg transition cursor-default"
              >
                <img
                  src={item.image_url ? baseImageUrl + item.image_url : 'https://via.placeholder.com/80x60?text=No+Image'}
                  alt={item.title}
                  className="w-20 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <h3
                    className="text-lg font-semibold dark:text-white truncate"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center text-yellow-500 text-sm select-none mt-1">
                    <IoStar />
                    <span className="ml-1 text-black dark:text-white">
                      {item.rating ? Number(item.rating).toFixed(1) : '৪.৫'}
                    </span>
                  </div>
                  <p
                    className="text-gray-700 dark:text-gray-300 mt-1 line-clamp-2"
                    title={item.description}
                  >
                    {item.description
                      .replace(/\r\n/g, '\n')
                      .replace(/\\n/g, '\n')
                      .replace(/\\r/g, '\n') || 'বিস্তারিত তথ্য পাওয়া যায়নি।'}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleViewRecipe(item)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label={`বিস্তারিত দেখুন ${item.title}`}
                    title="View Details"
                    type="button"
                  >
                    <IoEyeOutline className="w-6 h-6 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label={`এডিট ${item.title}`}
                    title="রেসিপি এডিট করুন"
                    type="button"
                  >
                    <IoPencilOutline className="w-6 h-6 text-green-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label={`মুছুন ${item.title}`}
                    title="রেসিপি মুছুন"
                    type="button"
                  >
                    <IoTrashBinOutline className="w-6 h-6 text-red-600" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <nav className="flex justify-center pt-10" aria-label="Page navigation">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            </li>

            {renderPagination()}

            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        {selectedRecipe && (
          <AdminViewRecipeModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            recipe={selectedRecipe}
            onSave={handleSaveRecipe}
          />
        )}
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminPanel;
