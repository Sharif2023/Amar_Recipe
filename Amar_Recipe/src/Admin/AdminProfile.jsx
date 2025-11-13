import React, { useState, useEffect } from "react";
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const AdminProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
  );
  const [isEditing, setIsEditing] = useState(false); // State to track if we're in edit mode
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
    city: admin?.city || "",
    state: admin?.state || "",
    experience: admin?.experience || "",
    portfolio: admin?.portfolio || "",
    certification: admin?.certification || ""
  });

  // Handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(URL.createObjectURL(file)); // Preview
      setSelectedImageFile(file); // Actual file for upload
    }
  };

  // Format the certification text into paragraphs
  const formatCertification = (certificationText) => {
    return certificationText.split("\n").map((line, index) => (
      <p key={index}>{line}</p>
    ));
  };

  // If admin data is not available, show unauthorized access message
  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg font-semibold">অননুমোদিত প্রবেশ</p>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Populate formData with the admin data
      setFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        city: admin.city,
        state: admin.state,
        experience: admin.experience,
        portfolio: admin.portfolio,
        certification: admin.certification,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const BASE_URL = API_CONFIG.BASE_URL;

    if (adminData) {
      setAdmin(adminData);

      if (adminData.profileImage) {
        const fullPath = adminData.profileImage.startsWith("http")
          ? adminData.profileImage
          : BASE_URL + adminData.profileImage;

        setProfileImage(fullPath);
      }
    }
  }, []);

  const handleSave = async () => {
    const updatedAdmin = { ...admin, profileImage, ...formData };

    const formDataToSend = new FormData();

    if (selectedImageFile) {
      formDataToSend.append("profileImage", selectedImageFile);
    }

    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("portfolio", formData.portfolio);
    formDataToSend.append("certification", formData.certification);
    formDataToSend.append("id", admin.id);

    try {
      const res = await fetch(
        getApiUrl(API_CONFIG.ADMIN.UPDATE_PROFILE),
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await res.json();

      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);

        const fullProfileImagePath = (result.profileImage || profileImage).startsWith("http")
          ? result.profileImage
          : API_CONFIG.BASE_URL + "/" + result.profileImage;

        const updatedAdminWithImage = {
          ...updatedAdmin,
          profileImage: fullProfileImagePath
        };


        // Save updated profile image in localStorage
        localStorage.setItem("admin", JSON.stringify(updatedAdminWithImage));
        setAdmin(updatedAdminWithImage);
        setProfileImage(fullProfileImagePath);
        setSelectedImageFile(null);
      } else {
        alert("প্রোফাইল আপডেট করার সময় ত্রুটি হয়েছে ⚠️");
      }
    } catch (error) {
      console.error("Error in fetching or parsing the response:", error);
      alert("প্রোফাইল আপডেটে একটি সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-rose-200">
      <h2 className="text-3xl font-extrabold text-rose-700 mb-8 border-b border-rose-300 pb-3">
        অ্যাডমিন প্রোফাইল
      </h2>

      {/* Profile Image Section */}
      <div className="flex justify-center mb-8">
        <div className="shrink-0">
          <img
            id="preview_img"
            className="h-32 w-32 object-cover rounded-full border-4 border-rose-600 shadow-md"
            src={profileImage}
            alt="Current profile"
          />
        </div>
      </div>

      {/* Edit Profile Image Section (Only visible when in edit mode) */}
      {isEditing && (
        <div className="mt-6 py-3 flex justify-center">
          <label className="block text-sm font-semibold text-gray-700 py-2 file:px-4">
            নতুন প্রোফাইল ছবি বেছে নিন
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="block w-70 max-w-md text-sm text-slate-500 bg-amber-100
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-rose-100 file:text-rose-700
        hover:file:bg-rose-200 ml-4"
          />
        </div>
      )}


      {/* Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
        <div>
          <p className="font-semibold text-lg mb-1">নাম</p>
          {!isEditing ? (
            <p className="text-gray-900">{admin.name}</p>
          ) : (
            <input
              type="text"
              name="name"
              value={formData.name} // Bind to formData
              onChange={handleInputChange} // Handle input change
              className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
            />
          )}
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">ইমেইল</p>
          {!isEditing ? (
            <p className="text-gray-900">{admin.email}</p>
          ) : (
            <input
              type="email"
              name="email"
              value={formData.email} // Bind to formData
              onChange={handleInputChange} // Handle input change
              className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
            />
          )}
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">মোবাইল</p>
          {!isEditing ? (
            <p className="text-gray-900">{admin.phone}</p>
          ) : (
            <input
              type="text"
              name="phone"
              value={formData.phone} // Bind to formData
              onChange={handleInputChange} // Handle input change
              className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
            />
          )}
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">শহর</p>
          {!isEditing ? (
            <p className="text-gray-900">{admin.city}</p>
          ) : (
            <input
              type="text"
              name="city"
              value={formData.city} // Bind to formData
              onChange={handleInputChange} // Handle input change
              className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
            />
          )}
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">বিভাগ</p>
          {!isEditing ? (
            <p className="text-gray-900">{admin.state}</p>
          ) : (
            <input
              type="text"
              name="state"
              value={formData.state} // Bind to formData
              onChange={handleInputChange} // Handle input change
              className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
            />
          )}
        </div>

        <div>
          <p className="font-semibold text-lg mb-1">রন্ধন দক্ষতা (বছর)</p>
          {!isEditing ? (
            <p className="text-gray-900">{admin.experience}</p>
          ) : (
            <input
              type="number"
              name="experience"
              value={formData.experience} // Bind to formData
              onChange={handleInputChange} // Handle input change
              className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
            />
          )}
        </div>

        <div className="sm:col-span-2">
          <p className="font-semibold text-lg mb-1">পোর্টফোলিও</p>
          {!isEditing ? (
            <a
              href={admin.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 hover:underline break-all"
            >
              {admin.portfolio}
            </a>
          ) : (
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio} // Bind to formData
              onChange={handleInputChange} // Handle input change
              className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
            />
          )}
        </div>

        <div className="sm:col-span-2">
          <p className="font-semibold text-lg mb-1">সার্টিফিকেশন তথ্য</p>
          <div>
            {!isEditing ? (
              <p className="text-gray-900">{formatCertification(admin.certification) || "নাই"}</p>
            ) : (
              <textarea
                name="certification"
                value={formData.certification} // Bind to formData
                onChange={handleInputChange} // Handle input change
                className="text-gray-900 w-full p-2 rounded-lg border-2 border-gray-300"
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Button at the bottom */}
      <div className="text-center mt-8">
        {!isEditing ? (
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 text-white bg-rose-600 rounded-full hover:bg-rose-700 transition"
          >
            পরিবর্তন আনুন
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-green-600 rounded-full hover:bg-green-700 transition"
          >
            পরিবর্তন সংরক্ষণ করুন
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
