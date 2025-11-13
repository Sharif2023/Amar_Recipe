import React, { useEffect, useState } from "react";
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const SubmissionRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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
  // ভিউ মডাল খুলুন
  const openViewModal = (submission) => {
    setSelectedSubmission(submission);
    setViewModalOpen(true);
  };

  // ভিউ মডাল বন্ধ করুন
  const closeViewModal = () => {
    setSelectedSubmission(null);
    setViewModalOpen(false);
  };

  // রিকুয়েষ্ট ফেচ করুন
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        getApiUrl(API_CONFIG.ADMIN_MANAGEMENT.GET_SUBMISSION_REQUESTS)
      );
      const json = await res.json();
      if (json.success) {
        setRequests(json.data);
      } else {
        alert("রিকুয়েষ্ট লোড করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      alert("ত্রুটি: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!window.confirm("আপনি কি নিশ্চিত এই সাবমিশন এপ্রুভ করতে চান?")) return;
    try {
      const res = await fetch(
        getApiUrl(API_CONFIG.ADMIN_MANAGEMENT.APPROVE_SUBMISSION),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            admin_name: admin.name,  // Pass admin name here
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        alert("সাবমিশন এপ্রুভ হয়েছে এবং 'আমার রেসিপি'তে যুক্ত করা হয়েছে।");
        setRequests((prev) => prev.filter((req) => req.id !== id));
      } else {
        alert("ব্যর্থ হয়েছে: " + json.message);
      }
    } catch (err) {
      alert("ত্রুটি: " + err.message);
    }
  };  
  
  // প্রত্যাখ্যান শুরু করুন
  const startReject = (id) => {
    setRejectingId(id);
    setRejectReason("");
  };

  const submitReject = async () => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!rejectReason.trim()) {
      alert("অনুগ্রহ করে প্রত্যাখ্যানের কারণ লিখুন।");
      return;
    }
    try {
      const res = await fetch(
        getApiUrl(API_CONFIG.ADMIN_MANAGEMENT.REJECT_SUBMISSION),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: rejectingId,
            reason: rejectReason,
            admin_name: admin.name,  // Pass admin name here
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        alert("সাবমিশন বাতিল হয়েছে।");
        setRequests((prev) => prev.filter((req) => req.id !== rejectingId));
        setRejectingId(null);
        setRejectReason("");
      } else {
        alert("ব্যর্থ হয়েছে: " + json.message);
      }
    } catch (err) {
      alert("ত্রুটি: " + err.message);
    }
  };  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">সাবমিশন রিকুয়েষ্ট তালিকা</h1>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-neutral-500 mt-10">কোনো সাবমিশন পাওয়া যায়নি।</p>
      ) : (
        <ul className="max-w-5xl mx-auto space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex flex-col md:flex-row items-center md:items-start bg-white dark:bg-[#262525] rounded-md shadow hover:shadow-lg p-4"
            >
              <div className="flex-shrink-0 w-24 h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mr-4">
                {req.image ? (
                  <img
                    src={`${API_CONFIG.BASE_URL}/${req.image}`}
                    alt={req.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    ছবি নেই
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h3
                  className="text-lg font-semibold dark:text-white truncate"
                  title={req.title}
                >
                  {req.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{req.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  প্রেরকের নাম: <strong>{req.organizerName}</strong>
                </p>
                <p className="text-sm mt-1">
                  অবস্থা:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === "Approved"
                      ? "bg-green-700 text-green-300"
                      : req.status === "Rejected"
                        ? "bg-red-700 text-red-300"
                        : "bg-yellow-700 text-yellow-300"
                      }`}
                  >
                    {req.status === "Pending"
                      ? "Pending"
                      : req.status === "Approved"
                        ? "অনুমোদিত"
                        : "প্রত্যাখ্যাত"}
                  </span>
                </p>
                {req.status === "Rejected" && req.comment && (
                  <p className="text-sm mt-1 text-red-400 italic">
                    বাতিলের কারণ: {req.comment}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                {req.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => openViewModal(req)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      দেখুন
                    </button>
                    <button
                      onClick={() => approveRequest(req.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      অনুমোদন
                    </button>
                    <button
                      onClick={() => startReject(req.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      বাতিল
                    </button>
                  </>
                ) : (
                  <em className="text-gray-400">কোনো অপশন নেই</em>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#262525] rounded p-6 max-w-3xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={closeViewModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:hover:text-white"
              aria-label="মডাল বন্ধ করুন"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              {selectedSubmission.title}
            </h2>

            {selectedSubmission.image ? (
              <img
                src={`${API_CONFIG.BASE_URL}/${selectedSubmission.image}`}
                alt={selectedSubmission.title}
                className="w-full max-h-64 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                ছবি নেই
              </div>
            )}

            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>রেসিপির নাম:</strong> {selectedSubmission.title}
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>রেসিপির ধরণ:</strong> {categoryBanglaMap[selectedSubmission.category] || selectedSubmission.category}
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>বানানোর প্রক্রিয়া:</strong>
            </p>
            <p className="mb-4 whitespace-pre-line text-gray-700 dark:text-gray-300">
              {selectedSubmission.description
                .replace(/\r\n/g, '\n')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\n')}
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>মন্তব্য:</strong><br />
              {selectedSubmission.comment && selectedSubmission.comment.trim() !== '' ? selectedSubmission.comment
                .replace(/\r\n/g, '\n')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\n') : 'নেই'}
            </p>

            {selectedSubmission.reference && (
              <p className="mb-2">
                <strong>রেফারেন্স লিংক: </strong>
                <a
                  href={selectedSubmission.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedSubmission.reference}
                </a>
              </p>
            )}

            {selectedSubmission.tutorialVideo && (
              <p className="mb-4">
                <strong>টিউটোরিয়াল ভিডিও: </strong>
                <a
                  href={selectedSubmission.tutorialVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  এখানে দেখুন
                </a>
              </p>
            )}

            <div className="border-t pt-4 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>অবস্থান:</strong> {selectedSubmission.location}</p>
              <p><strong>রেসিপিদাতার নাম:</strong> {selectedSubmission.organizerName}</p>
              <p><strong>ইমেইল:</strong> {selectedSubmission.organizerEmail || 'নাই'}</p>
            </div>
          </div>
        </div>
      )}

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">সাবমিশনটি বাতিল করুন</h2>
            <textarea
              className="w-full border border-gray-300 p-2 mb-4 rounded"
              rows="4"
              placeholder="রেসিপিটি বাতিলের কারণ লিখুন"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 border rounded"
              >
                রিজেক্ট বাতিল করুন
              </button>
              <button
                onClick={submitReject}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionRequest;
