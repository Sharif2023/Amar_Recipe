import React, { useEffect, useState } from 'react';
import AdminViewRecipeModal from './AdminViewRecipeModal';
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await fetch(getApiUrl(API_CONFIG.REPORTS.GET_ALL));
      const json = await res.json();
      if (json.success) {
        setReports(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const markasDone = async (id) => {
    console.log("Attempting to delete report with ID:", id);
    if (!window.confirm('আপনি কি নিশ্চিত এই রিপোর্ট সমাধান হয়েছে?')) return;

    try {
      const res = await fetch(getApiUrl(API_CONFIG.REPORTS.DELETE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();

      if (json.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        alert('রিপোর্টটি সফলভাবে সম্পন্ন হয়েছে হিসেবে চিহ্নিত করা হয়েছে।');
      } else {
        alert('রিপোর্টটি সম্পন্ন হিসেবে চিহ্নিত করা যায়নি: ' + json.message);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert('রিপোর্টটি সম্পন্ন হিসেবে চিহ্নিত করার সময় একটি ত্রুটি ঘটেছে: ' + error.message);
    }
  };

  const handleViewRecipe = (report) => {
    const recipeId = report.recipe_id;
    const matchedReport = reports.find((r) => r.recipe_id === recipeId);

    const recipe = {
      id: matchedReport.recipe_id,
      title: matchedReport.title,
      image_url: matchedReport.image_url,
      description: matchedReport.description,
      comment: matchedReport.comment,
      location: matchedReport.location,
      organizerName: matchedReport.organizerName,
      organizerEmail: matchedReport.organizerEmail,
    };

    setSelectedRecipe(recipe);
    setShowEditModal(true);
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
        setReports((prev) =>
          prev.map((report) =>
            report.recipe_id === updatedRecipe.id ? { ...report, ...updatedRecipe } : report
          )
        );
        alert('রেসিপি সফলভাবে আপডেট করা হয়েছে।');
        setShowEditModal(false);
      } else {
        alert('রেসিপি আপডেট করা যায়নি: ' + json.message);
      }
    } catch (error) {
      console.error(error);
      alert('ত্রুটি: ' + error.message);
    }
  };

  const deleteRecipe = async (recipeId) => {
    const confirmDelete = window.confirm(`আপনি কি নিশ্চিত যে আপনি রেসিপিটি মুছে ফেলতে চান? আইডিঃ ${recipeId}`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${backendBaseUrl}delete_recipe.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: recipeId }),
      });

      const json = await res.json();
      if (json.success) {
        setReports((prev) => prev.filter((r) => r.recipe_id !== recipeId));
        alert('রেসিপিটি সফলভাবে মুছে ফেলা হয়েছে');
      } else {
        alert('রেসিপি মুছে ফেলা যায়নি: ' + json.message);
      }
    } catch (error) {
      alert('রেসিপি মুছে ফেলা যায়নি। ত্রুটি: ' + error.message);
    }
  };

  const sendMail = async (report) => {
    // Simulate sending mail (or integrate your mail backend)
    alert(`মেইল পাঠান: ${report.reporter_email} কে রিপোর্ট সম্পর্কে। #${report.id}`);
  };

  if (loading) return <p>লোড হচ্ছে...</p>;

  if (reports.length === 0) return <p className='text-center text-neutral-500 mt-10'>কোনো রিপোর্ট পাওয়া যায়নি।</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold dark:text-white">রিপোর্ট তালিকা</h2>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border border-gray-300 p-2">রিপোর্ট আইডি</th>
            <th className="border border-gray-300 p-2">রেসিপির আইডি</th>
            <th className="border border-gray-300 p-2">কারণসমূহ</th>
            <th className="border border-gray-300 p-2">অন্যান্য কারণ</th>
            <th className="border border-gray-300 p-2">রিপোর্টার ইমেইল</th>
            <th className="border border-gray-300 p-2">স্ট্যাটাস</th>
            <th className="border border-gray-300 p-2">কর্ম</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="odd:bg-white even:bg-gray-100 dark:odd:bg-[#1b1b1b] dark:even:bg-[#262525]">
              <td className="border border-gray-300 p-2 text-center">{report.report_id}</td>
              <td className="border border-gray-300 p-2 text-center">{report.recipe_id}</td>

              <td className="border border-gray-300 p-2">
                {JSON.parse(report.reasons).join(', ')}
              </td>
              <td className="border border-gray-300 p-2">{report.other_reason || '-'}</td>
              <td className="border border-gray-300 p-2">{report.reporter_email || '-'}</td>
              <td className="border border-gray-300 p-2 text-center">{report.status}</td>
              <td className="border border-gray-300 p-2 flex justify-center gap-2">
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => markasDone(report.report_id)}
                  title="সম্পন্ন হিসেবে চিহ্নিত করুন"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
                <button
                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleViewRecipe(report)}
                  disabled={report.status === 'reviewed'}
                  title="রেসিপি দেখুন এবং পরিবর্তন করুন"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => deleteRecipe(report.recipe_id)}
                  title="রেসিপি মুছে ফেলুন"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => sendMail(report)}
                  title="Send Mail"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEditModal && selectedRecipe && (
        <AdminViewRecipeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          recipe={selectedRecipe}
          onSave={handleSaveRecipe}
        />
      )}
    </div>
  );
};

export default Reports;
