import React, { useEffect, useState } from "react";
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

const HistoryDropdown = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllHistories = async () => {
      try {
        const [subRes, adminRes] = await Promise.all([
          fetch(getApiUrl(API_CONFIG.ADMIN_MANAGEMENT.GET_SUBMISSION_HISTORY)),
          fetch(getApiUrl(API_CONFIG.ADMIN.GET_ACTIVITY_HISTORY))
        ]);

        const subJson = await subRes.json();
        const adminJson = await adminRes.json();

        if (subJson.success && adminJson.success) {
          const combined = [];

          for (const item of subJson.data) {
            combined.push({
              ...item,
              type: "recipe",
              activity_time: item.action_date ? new Date(item.action_date) : null
            });
          }

          for (const item of adminJson.data) {
            combined.push({
              ...item,
              type: "admin",
              activity_time: new Date(item.action_date)
            });
          }

          combined.sort((a, b) => b.activity_time - a.activity_time);

          setRequests(combined);
        } else {
          alert("Failed to fetch data.");
        }
      } catch (err) {
        alert("Error: " + err.message);
      }

      setLoading(false);
    };

    fetchAllHistories();
  }, []);


  return (
    <div className="container bg-rose-100/30 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">অ্যাডমিন একটিভিটি ইতিহাস</h1>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-neutral-500 mt-10">কোনো সাবমিশন পাওয়া যায়নি।</p>
      ) : (
        <ul className="max-w-5xl mx-auto space-y-4">
          {requests.map((req) => (
            <li
              key={req.id + req.type}
              className="flex flex-col md:flex-row items-center bg-white dark:bg-[#262525] rounded-md shadow hover:shadow-lg p-4"
            >
              {req.type === "recipe" ? (
                <>
                  <div className="w-24 h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mr-4">
                    {req.image ? (
                      <img
                        src={`${API_CONFIG.BASE_URL}/${req.image}`}
                        alt={req.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">কোনও ছবি নেই</div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-semibold dark:text-white truncate">রেসিপির নামঃ {req.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">রেসিপির ধরণঃ {categoryBanglaMap[req.category] || req.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">রেসিপিদাতার নামঃ <strong>{req.organizerName}</strong></p>
                    <p className="text-sm mt-1">
                      স্ট্যাটাসঃ
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status.toLowerCase() === "approved" ? "bg-green-700 text-green-300" : "bg-red-700 text-red-300"}`}>
                        {req.status}
                      </span>
                    </p>
                    {req.status === "rejected" && req.comment && (
                      <p className="text-sm mt-1 text-red-400 italic">কারণঃ {req.comment}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      অ্যাডমিনের নামঃ <strong>{req.admin_name}</strong>
                    </p>

                    <p className="text-xs text-gray-400 mt-1">অ্যাকশনের সময়ঃ {new Date(req.action_date).toLocaleString()}</p>
                  </div>
                </>
              ) : (
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold dark:text-white truncate">অ্যাডমিনের নামঃ {req.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">অ্যাডমিনের ইমেইলঃ {req.email}</p>
                  <p className="text-sm mt-1">
                    স্ট্যাটাসঃ
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === "approved" ? "bg-green-700 text-green-300" : "bg-red-700 text-red-300"}`}>{req.status}</span>
                  </p>
                  {req.status === "rejected" && req.rejection_reason && (
                    <p className="text-sm mt-1 text-red-400 italic">কারণঃ {req.rejection_reason}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">অ্যাকশনের সময়ঃ {req.action_date}</p>
                  <p className="text-xs font-medium text-indigo-500 mt-1">ধরণঃ {req.type === "recipe" ? "Recipe" : "Admin"}</p>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(req.activity_time).toLocaleString()}
                  </p>

                </div>
              )}
            </li>
          ))}

        </ul>
      )}
    </div>
  );
};

export default HistoryDropdown;
