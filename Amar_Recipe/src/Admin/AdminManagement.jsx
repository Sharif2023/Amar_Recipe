import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const AdminManagement = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isRootAdmin, setIsRootAdmin] = useState(false);

  const rootAdminEmail = "sharifislam0505@gmail.com";

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));

    if (!admin) {
      navigate("/adminlogin");
      return;
    }

    if (admin && admin.email === rootAdminEmail) {
      setIsRootAdmin(true);
    }
  }, [navigate]);

  const fetchRequests = async () => {
    const res = await fetch(getApiUrl(API_CONFIG.ADMIN_MANAGEMENT.GET_REQUESTS), {
      cache: "no-store",
    });
    const data = await res.json();
    console.log("Fetched updated data:", data);

    setPendingRequests(data.filter(admin => admin.status === "pending"));
    setApprovedAdmins(data.filter(admin => admin.status === "approved"));
  };


  useEffect(() => {
    fetchRequests();
  }, []);

  const formatCertification = (certificationText) => {
    return certificationText.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ));
  };

  const updateStatus = async (id, status) => {
    console.log(`Updating admin id=${id} to status=${status}`);

    const admin = JSON.parse(localStorage.getItem("admin"));

    try {
      const res = await fetch(getApiUrl(API_CONFIG.ADMIN.UPDATE_STATUS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_name: admin.name }),  // Include admin's name
      });
      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response JSON:', data);

      if (res.ok && data.message) {
        alert(data.message);
        fetchRequests(); // Refresh data after update
      } else {
        alert("স্ট্যাটাস আপডেট করা যায়নি: " + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error("আপডেটের সময় নেটওয়ার্ক বা সার্ভার ত্রুটি হয়েছে:", error);
      alert("আপডেট করার সময় নেটওয়ার্ক ত্রুটি হয়েছে");
    }
  };
  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই অ্যাডমিনকে মুছে ফেলতে চান?")) {
      const loggedInAdmin = JSON.parse(localStorage.getItem("admin"));

      try {
        const res = await fetch(getApiUrl('/admin_delete.php'), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminId,
            loggedInEmail: loggedInAdmin.email // Pass the logged-in admin's email
          })
        });

        const data = await res.json();
        if (data.success) {
          alert("অ্যাডমিন সফলভাবে মুছে ফেলা হয়েছে");
          fetchRequests();
        } else {
          alert(data.message || "অ্যাডমিন মুছে ফেলা যায়নি।");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("অ্যাডমিন মুছে ফেলার সময় ত্রুটি ঘটেছে ⚠️");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">অ্যাডমিন ম্যানেজমেন্ট প্যানেল</h1>

      {/* Pending Requests */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">আবেদনসমূহ</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600">নতুন কোনো আবেদন আসেনি</p>
        ) : (
          <table className="w-full border text-sm bg-white shadow">
            <thead>
              <tr className="bg-rose-100">
                <th className="px-3 py-2 text-left">নাম</th>
                <th className="px-3 py-2">ইমেইল</th>
                <th className="px-3 py-2">দক্ষতা</th>
                <th className="px-3 py-2">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((admin) => (
                <tr key={admin.id} className="border-t">
                  <td className="px-3 py-2">{admin.name}</td>
                  <td className="px-3 py-2">{admin.email}</td>
                  <td className="px-3 py-2">{admin.specialty}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      পর্যবেক্ষণ করুণ
                    </button>
                    <button
                      onClick={() => updateStatus(admin.id, "approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      আবেদন মঞ্জুর করুণ
                    </button>
                    <button
                      onClick={async () => {
                        const reason = prompt("আবেদন বাতিলের কারণ:");
                        if (!reason) return alert("আবেদন বাতিলের কারণ জানানো জরুরি.");
                        const admin = JSON.parse(localStorage.getItem("admin"));

                        try {
                          const res = await fetch("http://localhost/Amar_Recipies_jsx/Amar_Recipe/admin_api/admin_req_reject.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: adminId, reason, admin_name: admin.name }),
                          });

                          const text = await res.text();
                          console.log("Raw reject response text:", text);

                          // Try parsing the JSON
                          let data;
                          try {
                            data = JSON.parse(text);
                          } catch (parseErr) {
                            console.error("❌ JSON parse error:", parseErr);
                            alert("❌ সার্ভারের প্রতিক্রিয়াটি বৈধ JSON নয়। কনসোলটি পরীক্ষা করুন।");
                            return;
                          }

                          alert(data.success ? "✅ আবেদন বাতিল সফল হয়েছে" : data.message || "⚠️ অজানা ত্রুটি");
                          fetchRequests();
                        } catch (err) {
                          console.error("❌ Network error during fetch:", err);
                          alert("❌ নেটওয়ার্ক অনুরোধ ব্যর্থ হয়েছে।");
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      আবেদন বাতিল করুণ
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Approved Admins */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">অনুমোদিত অ্যাডমিনগণ</h2>
        {approvedAdmins.length === 0 ? (
          <p className="text-gray-600">এখন পর্যন্ত কোনো অনুমোদিত অ্যাডমিন নেই</p>
        ) : (
          <ul className="space-y-2">
            {approvedAdmins.map((admin) => (
              <li key={admin.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                <span>
                  <strong>{admin.name}</strong> – {admin.email}
                </span>
                <div className="flex space-x-4"> {/* Add this div to wrap the buttons */}
                  <button
                    onClick={() => setSelectedAdmin(admin)}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  {isRootAdmin && (
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for viewing admin details */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-md w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold text-rose-700 mb-4">অ্যাডমিন বিস্তারিত</h3>
            <ul className="text-sm text-gray-800 space-y-1">
              <li><strong>নাম:</strong> {selectedAdmin.name}</li>
              <li><strong>ইমেইল:</strong> {selectedAdmin.email}</li>
              <li><strong>মোবাইল:</strong> {selectedAdmin.phone}</li>
              <li><strong>দক্ষতা:</strong> {selectedAdmin.specialty}</li>
              <li><strong>অভিজ্ঞতা:</strong> {selectedAdmin.experience} years</li>
              <li><strong>সার্টিফিকেশন তথ্য:</strong> {formatCertification(selectedAdmin.certification)}</li>
              <li><strong>শহর:</strong> {selectedAdmin.city}</li>
              <li><strong>তারিখ:</strong> {selectedAdmin.date}</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="bg-rose-700 text-white px-4 py-2 rounded hover:bg-rose-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
